// src/api/admin/admin.controller.js
const bcrypt = require('bcrypt');
const prisma = require('../../config/prisma');

async function createRound(req, res) {
  const { name, startTime, endTime } = req.body;
  if (!name || !startTime || !endTime) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const round = await prisma.round.create({
      data: { name, startTime: new Date(startTime), endTime: new Date(endTime) },
    });
    res.status(201).json(round);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create round.' });
  }
}

async function createChallenge(req, res) {
  const { title, description, category, difficulty, points, flag, roundId } = req.body;
  if (!title || !flag || !roundId || !points) {
    return res.status(400).json({ message: 'Title, flag, roundId, and points are required.' });
  }

  try {
    // IMPORTANT: Always hash the flag before storing it
    const flagHash = await bcrypt.hash(flag, 10);
    const challenge = await prisma.challenge.create({
      data: { title, description, category, difficulty, points, flagHash, roundId },
    });
    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create challenge.' });
  }
}

async function createHint(req, res) {
  const { text, pointsDeduction, challengeId } = req.body;
  if (!text || !pointsDeduction || !challengeId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const hint = await prisma.hint.create({
      data: { text, pointsDeduction: parseInt(pointsDeduction, 10), challengeId },
    });
    res.status(201).json(hint);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create hint.' });
  }
}

async function updateChallenge(req, res) {
  const { id } = req.params;
  const { title, description, points } = req.body;
  try {
    const updated = await prisma.challenge.update({
      where: { id },
      data: { title, description, points },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update challenge." });
  }
}

async function deleteChallenge(req, res) {
  const { id } = req.params;
  try {
    await prisma.challenge.delete({ where: { id } });
    res.json({ message: "Challenge deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete challenge." });
  }
}

module.exports = { createRound, createChallenge, createHint, updateChallenge, deleteChallenge };