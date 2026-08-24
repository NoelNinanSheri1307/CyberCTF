// server.js
require('dotenv').config();
const app = require('./app');
const prisma = require('./src/config/prisma');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = '0.0.0.0';

async function startServer() {
  if (!process.env.DATABASE_URL) {
    console.error('[FATAL] DATABASE_URL environment variable is not defined.');
    console.error('Please configure your MongoDB Atlas connection string in the environment.');
    process.exit(1);
  }

  if (!process.env.JWT_SECRET) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[FATAL] JWT_SECRET environment variable is missing in production mode.');
      process.exit(1);
    } else {
      console.warn('[WARN] JWT_SECRET is not set. Using fallback for local development only.');
      process.env.JWT_SECRET = 'ctf-dev-fallback-secret-key-change-in-env';
    }
  }

  try {
    console.log('[INFO] Connecting to MongoDB Atlas cluster...');
    await prisma.$connect();
    console.log('[OK] Database connection verified successfully!');

    const server = app.listen(PORT, HOST, () => {
      console.log(`[READY] CTF Backend Server is listening on http://${HOST}:${PORT}`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DOCS] API Documentation: http://localhost:${PORT}/api/docs`);
      }
    });

    // Graceful Shutdown
    const shutdown = async (signal) => {
      console.log(`\n[INFO] Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        console.log('[INFO] HTTP server closed.');
        try {
          await prisma.$disconnect();
          console.log('[OK] Database disconnected cleanly.');
        } catch (dbErr) {
          console.error('[WARN] Error disconnecting database:', dbErr.message);
        }
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('[FATAL] Database connection failed at startup!');
    console.error(error.message || error);
    process.exit(1);
  }
}

startServer();