// src/api/challenges/challenges.routes.js
const express = require('express');
const {
  getAllChallenges,
  getActiveRounds,
  getChallengesByRound,
  unlockHint,
  submitFlag,
} = require('./challenges.controller');
const { authenticateToken } = require('../../middlewares/auth.middleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Challenges
 *   description: CTF challenges and rounds management
 */

// GET all challenges (Global, no round required)
router.get('/', authenticateToken, getAllChallenges);

// GET active rounds (for backwards compatibility)
router.get('/rounds', getActiveRounds);

// POST unlock a hint
router.post('/hints/:hintId/unlock', authenticateToken, unlockHint);

// GET challenges by round ID
router.get('/:roundId', authenticateToken, getChallengesByRound);

// POST submit flag
router.post('/:challengeId/submit', authenticateToken, submitFlag);

module.exports = router;
