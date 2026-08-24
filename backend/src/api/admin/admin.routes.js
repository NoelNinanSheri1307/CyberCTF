// src/api/admin/admin.routes.js
const express = require('express');
const { createRound, createChallenge, createHint } = require('./admin.controller');
const { requireAdmin } = require('../../middlewares/admin.middleware');

const router = express.Router();

// All routes in this file require the user to be an admin
router.use(requireAdmin);

/**
 * @swagger
 * /api/admin/rounds:
 *   post:
 *     summary: Create a new round
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - startTime
 *               - endTime
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Round 1"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-23T10:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-23T12:00:00Z"
 *     responses:
 *       '201':
 *         description: Round created successfully
 */
router.post('/rounds', createRound);

/**
 * @swagger
 * /api/admin/challenges:
 *   post:
 *     summary: Create a new challenge
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - points
 *               - roundId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "SQL Injection"
 *               description:
 *                 type: string
 *                 example: "Find the admin password by exploiting the login form."
 *               category:
 *                 type: string
 *                 example: "Web"
 *               points:
 *                 type: integer
 *                 example: 200
 *               roundId:
 *                 type: string
 *                 example: "round123"
 *     responses:
 *       '201':
 *         description: Challenge created successfully
 */
router.post('/challenges', createChallenge);

/**
 * @swagger
 * /api/admin/hints:
 *   post:
 *     summary: Create a new hint for a challenge
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - challengeId
 *               - text
 *               - pointsDeduction
 *             properties:
 *               challengeId:
 *                 type: string
 *                 example: "challenge123"
 *               text:
 *                 type: string
 *                 example: "Try using a UNION query to bypass authentication."
 *               pointsDeduction:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       '201':
 *         description: Hint created successfully
 */
router.post('/hints', createHint);

module.exports = router;
