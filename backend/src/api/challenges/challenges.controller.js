// src/api/challenges/challenges.controller.js
const prisma = require("../../config/prisma");
const bcrypt = require("bcrypt");

/**
 * Validate MongoDB ObjectId (24 hex chars)
 */
function isValidId(id) {
  return typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * GET /api/challenges
 * Fetch ALL challenges with user solve status
 */
async function getAllChallenges(req, res) {
  const teamId = req.teamId;

  try {
    const challenges = await prisma.challenge.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        difficulty: true,
        points: true,
        resourceUrl: true,
        hints: {
          select: {
            id: true,
            pointsDeduction: true,
          },
        },
      },
      orderBy: [
        { points: "asc" },
        { title: "asc" },
      ],
    });

    // Fetch all solves for this user
    const teamSolves = await prisma.solve.findMany({
      where: { teamId },
      select: { challengeId: true },
    });

    // Fetch all hints unlocked by this user
    const teamHintUnlocks = await prisma.hintUnlock.findMany({
      where: { teamId },
      select: { hintId: true },
    });
    const unlockedHintIds = new Set(teamHintUnlocks.map((u) => u.hintId));
    const solvedChallengeIds = new Set(teamSolves.map((s) => s.challengeId));

    const challengesWithSolved = challenges.map((ch) => ({
      ...ch,
      solved: solvedChallengeIds.has(ch.id),
      hints: ch.hints.map((h) => ({
        ...h,
        unlocked: unlockedHintIds.has(h.id),
      })),
    }));

    return res.json(challengesWithSolved);
  } catch (error) {
    console.error("Error fetching all challenges:", error);
    return res.status(500).json({ message: "Failed to load challenges." });
  }
}

/**
 * GET /api/challenges/rounds
 * Fetch all competition rounds
 */
async function getActiveRounds(req, res) {
  try {
    const rounds = await prisma.round.findMany({
      orderBy: { startTime: "asc" },
      include: {
        _count: {
          select: { challenges: true },
        },
      },
    });

    const now = new Date();

    const formattedRounds = rounds.map((round) => {
      const start = new Date(round.startTime);
      const end = new Date(round.endTime);
      const isActive = now >= start && now <= end;
      const isUpcoming = now < start;
      const isEnded = now > end;

      return {
        id: round.id,
        name: round.name,
        startTime: round.startTime,
        endTime: round.endTime,
        isActive,
        isUpcoming,
        isEnded,
        challengeCount: round._count.challenges,
      };
    });

    return res.json(formattedRounds);
  } catch (err) {
    console.error("Error in getActiveRounds:", err);
    return res.status(500).json({ message: "Failed to fetch competition rounds." });
  }
}

/**
 * GET /api/challenges/:roundId
 * Fetch challenges for a specific round
 */
async function getChallengesByRound(req, res) {
  const { roundId } = req.params;
  const teamId = req.teamId;

  if (!isValidId(roundId)) {
    return res.status(400).json({ message: "Invalid round ID format." });
  }

  try {
    const round = await prisma.round.findUnique({
      where: { id: roundId },
      include: {
        challenges: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            difficulty: true,
            points: true,
            resourceUrl: true,
            hints: {
              select: {
                id: true,
                pointsDeduction: true,
              },
            },
          },
        },
      },
    });

    if (!round) {
      return res.status(404).json({ message: "Round not found." });
    }

    const teamSolves = await prisma.solve.findMany({
      where: {
        teamId,
        challenge: {
          roundId,
        },
      },
      select: { challengeId: true },
    });

    const teamHintUnlocks = await prisma.hintUnlock.findMany({
      where: { teamId },
      select: { hintId: true },
    });
    const unlockedHintIds = new Set(teamHintUnlocks.map((u) => u.hintId));
    const solvedChallengeIds = new Set(teamSolves.map((s) => s.challengeId));

    const challengesWithSolved = round.challenges.map((ch) => ({
      ...ch,
      solved: solvedChallengeIds.has(ch.id),
      hints: ch.hints.map((h) => ({
        ...h,
        unlocked: unlockedHintIds.has(h.id),
      })),
    }));

    return res.json(challengesWithSolved);
  } catch (error) {
    if (error.code === "P2023") {
      return res.status(400).json({ message: "Invalid round ID." });
    }
    console.error("Error fetching challenges by round:", error);
    return res.status(500).json({ message: "Failed to load challenges." });
  }
}

/**
 * POST /api/challenges/hints/:hintId/unlock
 */
async function unlockHint(req, res) {
  try {
    const { hintId } = req.params;
    const teamId = req.teamId;

    if (!isValidId(hintId)) {
      return res.status(400).json({ message: "Invalid hint ID format." });
    }

    const hint = await prisma.hint.findUnique({
      where: { id: hintId },
      include: {
        challenge: {
          select: { id: true, title: true, points: true },
        },
      },
    });

    if (!hint) {
      return res.status(404).json({ message: "Hint not found." });
    }

    const existingUnlock = await prisma.hintUnlock.findFirst({
      where: { teamId, hintId },
    });

    if (existingUnlock) {
      return res.json({
        message: "Hint already unlocked",
        text: hint.text,
        pointsDeduction: hint.pointsDeduction,
      });
    }

    await prisma.hintUnlock.create({
      data: { teamId, hintId },
    });

    return res.json({
      message: "Hint unlocked successfully",
      text: hint.text,
      pointsDeduction: hint.pointsDeduction,
    });
  } catch (error) {
    console.error("Error in unlockHint:", error);
    return res.status(500).json({ message: "Failed to unlock hint." });
  }
}

/**
 * POST /api/challenges/:challengeId/submit
 */
async function submitFlag(req, res) {
  try {
    const { challengeId } = req.params;
    const { flag } = req.body;
    const teamId = req.teamId;

    if (!isValidId(challengeId)) {
      return res.status(400).json({ message: "Invalid challenge ID format." });
    }

    if (!flag || typeof flag !== "string" || !flag.trim()) {
      return res.status(400).json({ message: "Flag cannot be empty." });
    }

    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found." });
    }

    // Check if already solved
    const existingSolve = await prisma.solve.findFirst({
      where: { teamId, challengeId },
    });

    if (existingSolve) {
      return res.status(200).json({
        correct: true,
        alreadySolved: true,
        message: "This challenge has already been solved by you.",
      });
    }

    // Verify flag using bcrypt comparison
    const isMatch = await bcrypt.compare(flag.trim(), challenge.flagHash);
    if (!isMatch) {
      return res.status(200).json({
        correct: false,
        message: "Incorrect flag. Try again!",
      });
    }

    // Count hints unlocked by this user for this challenge
    const hintCount = await prisma.hintUnlock.count({
      where: { teamId, hint: { challengeId } },
    });

    // Multiplier calculation
    let multiplier = 1.0;
    if (hintCount === 1) multiplier = 0.9;
    else if (hintCount === 2) multiplier = 0.75;
    else if (hintCount >= 3) multiplier = 0.5;

    const awardedPoints = Math.floor(challenge.points * multiplier);

    // Save solve
    try {
      await prisma.solve.create({
        data: { teamId, challengeId },
      });
    } catch (err) {
      if (err.code === "P2002") {
        return res.status(200).json({
          correct: true,
          alreadySolved: true,
          message: "This challenge was already solved.",
        });
      }
      throw err;
    }

    // Upsert user score
    const updatedScore = await prisma.teamScore.upsert({
      where: { teamId },
      update: { points: { increment: awardedPoints } },
      create: { teamId, points: awardedPoints },
    });

    return res.status(200).json({
      correct: true,
      message: "Correct flag! Well done operative.",
      awardedPoints,
      totalScore: updatedScore.points,
    });
  } catch (error) {
    console.error("Error in submitFlag:", error);
    return res.status(500).json({ message: "Failed to process flag submission." });
  }
}

module.exports = {
  getAllChallenges,
  getChallengesByRound,
  unlockHint,
  submitFlag,
  getActiveRounds,
};
