// src/api/team/team.controller.js
const bcrypt = require('bcrypt');
const prisma = require('../../config/prisma');

/**
 * GET /api/team/me
 * Profile of the authenticated user
 */
async function getMyTeamProfile(req, res) {
  const teamId = req.teamId;
  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: {
        id: true,
        name: true,
        isAdmin: true,
        createdAt: true,
        teamScore: {
          select: { points: true, updatedAt: true },
        },
        _count: {
          select: {
            solves: true,
            hintUnlocks: true,
          },
        },
      },
    });

    if (!team) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({
      id: team.id,
      name: team.name,
      isAdmin: team.isAdmin,
      createdAt: team.createdAt,
      points: team.teamScore ? team.teamScore.points : 0,
      solvesCount: team._count.solves,
      hintsUsedCount: team._count.hintUnlocks,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ message: 'Failed to retrieve profile.' });
  }
}

/**
 * PATCH /api/team/me
 * Update user password or username
 */
async function updateTeam(req, res) {
  const teamId = req.teamId;
  const { name, password, currentPassword } = req.body;

  try {
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return res.status(404).json({ message: "User not found." });

    if (password) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to set a new password." });
      }
      const match = await bcrypt.compare(currentPassword, team.passwordHash);
      if (!match) {
        return res.status(401).json({ message: "Current password is incorrect." });
      }
    }

    const data = {};
    if (name && name.trim()) {
      const trimmedName = name.trim();
      if (trimmedName !== team.name) {
        const existing = await prisma.team.findUnique({ where: { name: trimmedName } });
        if (existing) {
          return res.status(409).json({ message: "Username already taken." });
        }
        data.name = trimmedName;
      }
    }

    if (password && password.length >= 4) {
      data.passwordHash = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.team.update({
      where: { id: teamId },
      data,
      select: { id: true, name: true, createdAt: true },
    });

    return res.json({ message: "Account updated successfully", user: updated });
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ message: "Failed to update profile." });
  }
}

/**
 * GET /api/team/progress
 * Solved challenges and unlocked hints for the authenticated user
 */
async function getMyProgress(req, res) {
  const teamId = req.teamId;
  try {
    const solves = await prisma.solve.findMany({
      where: { teamId },
      include: {
        challenge: {
          select: {
            id: true,
            title: true,
            points: true,
            category: true,
            difficulty: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const hints = await prisma.hintUnlock.findMany({
      where: { teamId },
      include: {
        hint: {
          select: {
            id: true,
            text: true,
            pointsDeduction: true,
            challengeId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ solves, hints });
  } catch (err) {
    console.error("Get progress error:", err);
    return res.status(500).json({ message: "Failed to fetch progress." });
  }
}

module.exports = { getMyTeamProfile, updateTeam, getMyProgress };