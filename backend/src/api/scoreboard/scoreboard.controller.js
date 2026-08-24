// src/api/scoreboard/scoreboard.controller.js
const prisma = require('../../config/prisma');

async function getScoreboard(req, res) {
  try {
    // Only include non-admin teams that have solved at least 1 challenge or scored points
    const teams = await prisma.team.findMany({
      where: {
        isAdmin: false,
        solves: {
          some: {}, // Has at least one solve
        },
      },
      select: {
        id: true,
        name: true,
        teamScore: {
          select: {
            points: true,
            updatedAt: true,
          },
        },
        solves: {
          select: {
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    const leaderboard = teams.map((team) => {
      const points = team.teamScore ? team.teamScore.points : 0;
      const lastSolveTime = team.solves.length > 0 ? team.solves[0].createdAt : null;

      return {
        id: team.id,
        name: team.name,
        points,
        solveCount: team.solves.length,
        lastSolve: lastSolveTime,
      };
    });

    // Deterministic sorting:
    // 1. Higher points first (descending)
    // 2. Tie-breaker: earlier lastSolve timestamp wins (ascending)
    leaderboard.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      if (!a.lastSolve && !b.lastSolve) return a.name.localeCompare(b.name);
      if (!a.lastSolve) return 1;
      if (!b.lastSolve) return -1;
      return new Date(a.lastSolve).getTime() - new Date(b.lastSolve).getTime();
    });

    const rankedLeaderboard = leaderboard.map((item, index) => ({
      rank: index + 1,
      ...item,
    }));

    return res.json(rankedLeaderboard);
  } catch (error) {
    console.error('Error fetching scoreboard:', error);
    return res.status(500).json({ message: 'Failed to fetch scoreboard.' });
  }
}

module.exports = { getScoreboard };