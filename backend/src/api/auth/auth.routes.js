// api/auth/auth.routes.js
const express = require('express');
const { registerTeam, loginTeam } = require('./auth.controller');
const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new team
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamCredentials'
 *     responses:
 *       '201':
 *         description: Team registered successfully
 *       '409':
 *         description: Team name already taken
 */

router.post('/register', registerTeam);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a team to get a JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamCredentials'
 *     responses:
 *       '200':
 *         description: Login successful, returns JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       '401':
 *         description: Invalid credentials
 */

router.post('/login', loginTeam);

module.exports = router;