// src/api/team/team.routes.js
const express = require('express');
const { getMyTeamProfile, updateTeam, getMyProgress } = require('./team.controller');
const { authenticateToken } = require('../../middlewares/auth.middleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Team
 *   description: Team profile and progress endpoints
 */

router.get('/me', authenticateToken, getMyTeamProfile);
router.patch('/me', authenticateToken, updateTeam);
router.get('/progress', authenticateToken, getMyProgress);

module.exports = router;