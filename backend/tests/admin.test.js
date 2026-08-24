const request = require('supertest');
const app = require('../app');
const { createAdmin } = require('./helpers');

describe('Admin API', () => {
  let adminToken;

  beforeAll(async () => {
    adminToken = await createAdmin();
  });

  it('should create a round', async () => {
    const res = await request(app)
      .post('/api/admin/rounds')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Round 1',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(),
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
