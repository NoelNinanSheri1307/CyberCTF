const request = require('supertest');
const app = require('../app');
const prisma = require('../src/config/prisma');

let token;

beforeAll(async () => {
  await prisma.team.deleteMany(); // Clean DB before tests
});

afterAll(async () => {
  await prisma.$disconnect();
});

const { createTeam } = require('./helpers');

describe('Auth API', () => {
  it('should register and login', async () => {
    const token = await createTeam();
    expect(token).toBeDefined();
  });
});


module.exports = { token };
