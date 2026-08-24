const prisma = require("../../config/prisma");

/**
 * GET /api/score/my
 * Get logged-in team’s score
 */
async function getMyScore(req, res) {
  try {
    const teamId = req.teamId;
    const score = await prisma.teamScore.findUnique({
      where: { teamId },
    });

    if (!score) return res.json({ teamId, points: 0 });

    res.json(score);
  } catch (err) {
    console.error("Error fetching team score:", err);
    res.status(500).json({ message: "Failed to fetch score" });
  }
}

/**
 * GET /api/score
 * Get leaderboard from TeamScore
 */
async function getScoreboard(req, res) {
  try {
    const scores = await prisma.teamScore.findMany({
      where: {
        points: { gt: 0 },
        team: { isAdmin: false },
      },
      include: { team: { select: { id: true, name: true } } },
      orderBy: [{ points: "desc" }, { updatedAt: "asc" }],
    });

    res.json(
      scores.map((s, index) => ({
        rank: index + 1,
        id: s.team.id,
        name: s.team.name,
        points: s.points,
        updatedAt: s.updatedAt,
      }))
    );
  } catch (err) {
    console.error("Error fetching scoreboard:", err);
    res.status(500).json({ message: "Failed to fetch scoreboard" });
  }
}

module.exports = { getMyScore, getScoreboard };
