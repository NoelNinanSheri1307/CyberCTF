//tests/helpers.js
const request = require('supertest');
const app = require('../app');
const prisma = require('../src/config/prisma');
const bcrypt = require('bcryptjs');

async function createTeam(name = 'TeamRocket', password = 'password123') {
  await prisma.team.deleteMany({ where: { name } });

  await request(app).post('/api/auth/register').send({ name, password });

  const res = await request(app).post('/api/auth/login').send({ name, password });
  return res.body.token;
}

async function createAdmin(name = 'AdminTeam', password = 'adminpass') {
  await prisma.team.deleteMany({ where: { name } });

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.team.create({
    data: { name, passwordHash, isAdmin: true },
  });

  const res = await request(app).post('/api/auth/login').send({ name, password });
  return res.body.token;
}

module.exports = { createTeam, createAdmin };
