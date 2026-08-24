// src/api/hint/hint.controller.js
const prisma = require('../../config/prisma');

/**
 * Create a new hint for a challenge
 * POST /api/hints/:challengeId
 */
async function addHint(req, res) {
  try {
    const { challengeId } = req.params;
    const { text, pointsDeduction } = req.body;

    if (!text || pointsDeduction == null) {
      return res.status(400).json({ message: "Text and pointsDeduction are required." });
    }

    // Check challenge exists
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      include: { hints: true },
    });

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found." });
    }

    // ✅ Enforce max 3 hints per challenge
    if (challenge.hints.length >= 3) {
      return res.status(400).json({ message: "This challenge already has 3 hints." });
    }

    const hint = await prisma.hint.create({
      data: {
        text,
        pointsDeduction: Number(pointsDeduction),
        challengeId: challengeId,
      },
    });

    return res.status(201).json({ message: "Hint created", hint });
  } catch (error) {
    console.error("Error in addHint:", error);
    return res.status(500).json({ message: "Failed to create hint." });
  }
}

/**
 * Update an existing hint
 * PATCH /api/hints/:hintId
 */
async function updateHint(req, res) {
  try {
    const { hintId } = req.params;
    const { text, pointsDeduction } = req.body;

    const hint = await prisma.hint.update({
      where: { id: hintId },
      data: {
        ...(text && { text }),
        ...(pointsDeduction != null && { pointsDeduction: Number(pointsDeduction) }),
      },
    });

    return res.json({ message: "Hint updated", hint });
  } catch (error) {
    console.error("Error in updateHint:", error);
    return res.status(500).json({ message: "Failed to update hint." });
  }
}

/**
 * Delete a hint
 * DELETE /api/hints/:hintId
 */
async function deleteHint(req, res) {
  try {
    const { hintId } = req.params;

    await prisma.hint.delete({
      where: { id: hintId },
    });

    return res.json({ message: "Hint deleted" });
  } catch (error) {
    console.error("Error in deleteHint:", error);
    return res.status(500).json({ message: "Failed to delete hint." });
  }
}

/**
 * Get all hints for a challenge
 * GET /api/hints/:challengeId
 */
async function getHintsByChallenge(req, res) {
  try {
    const { challengeId } = req.params;

    const hints = await prisma.hint.findMany({
      where: { challengeId },
    });

    return res.json({ hints });
  } catch (error) {
    console.error("Error in getHintsByChallenge:", error);
    return res.status(500).json({ message: "Failed to fetch hints." });
  }
}

module.exports = {
  addHint,
  updateHint,
  deleteHint,
  getHintsByChallenge,
};
