const request = require('supertest');
const app = require('../app');
const { createTeam } = require('./helpers');

describe('Team API', () => {
  let token;

  beforeAll(async () => {
    token = await createTeam();
  });

  it('should fetch the logged-in team profile', async () => {
    const res = await request(app)
      .get('/api/team/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'TeamRocket');
  });
});
