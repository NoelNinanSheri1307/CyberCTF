//tests/challenges.test.js
const request = require("supertest");
const app = require("../app");
const prisma = require("../src/config/prisma");
const bcrypt = require("bcrypt");

describe("Challenges API", () => {
  let round, challenge, token;

  beforeAll(async () => {
    await prisma.solve.deleteMany({});
    await prisma.challenge.deleteMany({});
    await prisma.round.deleteMany({});
    await prisma.team.deleteMany({});

    // Register team
    await request(app).post("/api/auth/register").send({
      name: "team_test",
      password: "testpass",
    });

    // Login team
    const loginRes = await request(app).post("/api/auth/login").send({
      name: "team_test",
      password: "testpass",
    });

    token = loginRes.body.token;

    // Create round
    round = await prisma.round.create({
      data: {
        name: "Round 1",
        startTime: new Date(),
        endTime: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    // Create challenge
    challenge = await prisma.challenge.create({
      data: {
        title: "Test Challenge",
        description: "Solve me",
        category: "Crypto",
        difficulty: "easy",
        points: 100,
        flagHash: await bcrypt.hash("flag{test}", 10),
        roundId: round.id,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return 200 and challenges for an existing round", async () => {
    const res = await request(app)
      .get(`/api/challenges/${round.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toMatchObject({
      id: expect.any(String),
      title: "Test Challenge",
      category: "Crypto",
      solved: expect.any(Boolean),
    });
  });

  it("should return 404 for a non-existent round", async () => {
    const res = await request(app)
      .get(`/api/challenges/nonexistentid`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Round not found");
  });

  it("should return 400 for invalid roundId format", async () => {
    const res = await request(app)
      .get(`/api/challenges/`) // empty ID
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "Invalid round ID format"
    );
  });
});
