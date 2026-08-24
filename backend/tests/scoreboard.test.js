//tests/scoreboard.test.js
const request = require('supertest');
const app = require('../app');

describe('Scoreboard API', () => {
  it('should return the scoreboard', async () => {
    const res = await request(app).get('/api/scoreboard');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
