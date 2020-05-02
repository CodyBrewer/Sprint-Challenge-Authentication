const request = require('supertest');
const jwt = require('jsonwebtoken');
const server = require('../api/server.js');
const db = require('../database/dbConfig.js');

beforeEach(async () => {
  await db.from('users').truncate();
});

describe('POST /register', () => {
  it('should return a 401 when missing a username or password', async () => {
    const missingPassword = { username: 'stan' };
    const missingUsername = { password: 'hello' };
    const missingBoth = {};

    const missingPassRes = await request(server)
      .post('/api/auth/register')
      .send(missingPassword);

    const missingUserRes = await request(server)
      .post('/api/auth/register')
      .send(missingUsername);

    const missingBothRes = await request(server)
      .post('/api/auth/register')
      .send(missingBoth);

    expect(missingPassRes.status).toBe(401);
    expect(missingUserRes.status).toBe(401);
    expect(missingBothRes.status).toBe(401);
  });
  it('should return a 201 when registering a user is successful', async () => {
    const user = { username: 'test', password: 'password123' };
    const res = await request(server)
      .post('/api/auth/register')
      .send(user);

    expect(res.status).toBe(201);
  });
  it('should successfully register a new user', async () => {
    const user = { username: 'stan', password: 'smith' };
    const res = await request(server)
      .post('/api/auth/register')
      .send(user);

    const users = await db.select('*').from('users');
    expect(users.length).toBe(1);
    expect(users[0].username).toBe('stan');
    expect(users[0].password).not.toBe('smith');
  });
});

describe('POST /login', () => {
  beforeEach(async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'stan', password: 'smith' });
  });

  it('should return a 200 when a user successfully logs in', async () => {
    const user = { username: 'stan', password: 'smith' };
    
    const res = await request(server)
      .post('/api/auth/login')
      .send(user);
    
    expect(res.status).toBe(200);
  });
  it('should return a token with the user\'s id when a user successfully logs in', async () => {
    const user = { username: 'stan', password: 'smith' };
    
    const res = await request(server)
    .post('/api/auth/login')
    .send(user);
    
    const decoded = jwt.decode(res.body.token);
    
    expect(decoded.sub).toBe(1);
  });
  it('should return a 401 when the user provides invalid credenitals', async () => {
    const user = { username: 'stan', password: 'roger' };

    const res = await request(server)
    .post('/api/auth/login')
    .send(user);

    expect(res.status).toBe(401);
  });
})