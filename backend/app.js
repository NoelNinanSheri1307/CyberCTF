// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const setupSwagger = require('./src/config/swagger');

// Import routes
const authRoutes = require('./src/api/auth/auth.routes');
const teamRoutes = require('./src/api/team/team.routes');
const challengeRoutes = require('./src/api/challenges/challenges.routes');
const scoreboardRoutes = require('./src/api/scoreboard/scoreboard.routes');
const adminRoutes = require('./src/api/admin/admin.routes');
const scoreRoutes = require('./src/api/score/teamScore.routes');
const hintRoutes = require('./src/api/hint/hint.routes');

const app = express();

// Enable trust proxy for Render / load balancer environments
app.set('trust proxy', 1);

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Swagger and WebGL friendly
    crossOriginEmbedderPolicy: false,
  })
);

// CORS Configuration
const parseAllowedOrigins = () => {
  const defaults = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ];
  if (process.env.FRONTEND_URL) {
    const configured = process.env.FRONTEND_URL.split(',')
      .map((url) => url.trim().replace(/\/+$/, ''))
      .filter(Boolean);
    return [...configured, ...defaults];
  }
  return defaults;
};

const allowedOrigins = parseAllowedOrigins();

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, server-to-server, health checks)
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/+$/, '');
      if (
        process.env.NODE_ENV !== 'production' ||
        allowedOrigins.includes(normalizedOrigin) ||
        allowedOrigins.includes('*')
      ) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// JSON body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Auth rate limiter (prevents brute force attacks)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts. Please try again later.' },
});

// Swagger API Documentation
setupSwagger(app);

// Health Check Endpoints (Supports both /health and /api/health for Render)
app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root welcome endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'CTF Arena Backend API is operational' });
});

// Mount API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/hints', hintRoutes);
app.use('/api/score', scoreRoutes);
app.use('/api/scoreboard', scoreboardRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (err.message === 'Blocked by CORS policy') {
    return res.status(403).json({ message: 'Forbidden by CORS policy.' });
  }

  console.error('[ERROR] Unhandled Server Error:', err.message || err);
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'An unexpected internal server error occurred.'
      : err.message || 'Internal Server Error';

  res.status(status).json({ message });
});

module.exports = app;
