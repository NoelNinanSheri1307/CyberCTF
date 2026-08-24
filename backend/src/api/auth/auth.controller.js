const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../../config/prisma');

/**
 * Handles new user/operative registration.
 */
async function registerTeam(req, res) {
  try {
    const { name, password } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Username is required.' });
    }

    if (!password || typeof password !== 'string' || password.length < 4) {
      return res.status(400).json({ message: 'Password must be at least 4 characters long.' });
    }

    const trimmedName = name.trim();

    // Check if username already exists
    const existingTeam = await prisma.team.findUnique({
      where: { name: trimmedName },
    });

    if (existingTeam) {
      return res.status(409).json({ message: 'Username is already taken. Please choose another username.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newTeam = await prisma.team.create({
      data: {
        name: trimmedName,
        passwordHash,
        isAdmin: false,
      },
      select: {
        id: true,
        name: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    // Initialize score
    await prisma.teamScore.create({
      data: {
        teamId: newTeam.id,
        points: 0,
      },
    });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(201).json({
        message: 'Account registered successfully!',
        user: newTeam,
      });
    }

    const payload = {
      teamId: newTeam.id,
      name: newTeam.name,
      isAdmin: newTeam.isAdmin,
    };

    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });

    return res.status(201).json({
      message: 'Account registered successfully!',
      token,
      user: newTeam,
      team: newTeam,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ message: 'An error occurred during registration. Please try again later.' });
  }
}

/**
 * Handles user login and JWT generation.
 */
async function loginTeam(req, res) {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: 'Both username and password are required.' });
    }

    const trimmedName = typeof name === 'string' ? name.trim() : '';

    const team = await prisma.team.findUnique({
      where: { name: trimmedName },
    });

    if (!team) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, team.passwordHash);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('FATAL: JWT_SECRET environment variable is missing.');
      return res.status(500).json({ message: 'Server configuration error.' });
    }

    const payload = {
      teamId: team.id,
      name: team.name,
      isAdmin: team.isAdmin,
    };

    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: team.id,
        name: team.name,
        isAdmin: team.isAdmin,
      },
      team: {
        id: team.id,
        name: team.name,
        isAdmin: team.isAdmin,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'An error occurred during login. Please try again.' });
  }
}

module.exports = {
  registerTeam,
  loginTeam,
};