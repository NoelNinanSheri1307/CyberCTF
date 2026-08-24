// src/config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// --- Main Swagger Configuration Object ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CTF Backend API',
      version: '1.0.0',
      description: 'API documentation for the CTF platform backend.',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
      },
    ],
    tags: [
      { name: 'Auth', description: 'Team authentication' },
      { name: 'Team', description: 'Team-specific operations' },
      { name: 'Challenges', description: 'Viewing and interacting with CTF challenges' },
      { name: 'Scoreboard', description: 'The public leaderboard' },
      { name: 'Admin', description: 'Admin-only operations (managing rounds, challenges, and hints)' },
    ],
    components: {
      schemas: {
        TeamCredentials: {
          type: 'object',
          required: ['name', 'password'],
          properties: {
            name: {
              type: 'string',
              description: 'The unique name of the team.',
              example: 'TeamRocket',
            },
            password: {
              type: 'string',
              description: "The team's password.",
              example: 'password123',
            },
          },
        },
        Challenge: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string' },
            points: { type: 'integer' },
            isSolved: { type: 'boolean' },
            hints: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  pointsDeduction: { type: 'integer' },
                },
              },
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Path to the files containing OpenAPI definitions
  apis: ['./src/api/**/*.routes.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// --- Function to set up Swagger UI ---
function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  console.log('📄 Swagger UI is available at http://localhost:3000/api-docs');
}

module.exports = setupSwagger;
