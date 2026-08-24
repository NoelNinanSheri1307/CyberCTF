const express = require("express");
const { authenticateToken } = require("../../middlewares/auth.middleware");
const { getMyScore, getScoreboard } = require("./teamScore.controller");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Score
 *   description: Team scores and leaderboard
 */

/**
 * @swagger
 * /api/score/my:
 *   get:
 *     summary: Get the logged-in team's current score
 *     description: Returns the score of the team making the request.
 *     tags: [Score]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Team score retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 teamId:
 *                   type: string
 *                   example: 65123abcd456ef7890123456
 *                 points:
 *                   type: integer
 *                   example: 150
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-09-23T18:25:43.511Z
 *       401:
 *         description: Unauthorized (missing/invalid token)
 */
router.get("/my", authenticateToken, getMyScore);

/**
 * @swagger
 * /api/score:
 *   get:
 *     summary: Get the global scoreboard
 *     description: Returns all teams ranked by score.
 *     tags: [Score]
 *     responses:
 *       200:
 *         description: Scoreboard retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 65123abcd456ef7890123456
 *                   name:
 *                     type: string
 *                     example: Team Alpha
 *                   points:
 *                     type: integer
 *                     example: 350
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-09-23T18:25:43.511Z
 */
router.get("/", getScoreboard);

module.exports = router;
