// src/api/scoreboard/scoreboard.routes.js
const express = require('express');
const { getScoreboard } = require('./scoreboard.controller');
const router = express.Router();

/**
 * @swagger
 * /api/scoreboard:
 *   get:
 *     summary: Get the live scoreboard
 *     tags: [Scoreboard]
 *     responses:
 *       '200':
 *         description: A ranked list of teams and their scores
 */

router.get('/', getScoreboard);  // ✅ was '/scoreboard'

module.exports = router;
