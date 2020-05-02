const request = require('supertest');
const jwt = require('jsonwebtoken');
const server = require('../api/server.js');
const db = require('../database/dbConfig.js');

beforeEach(async () => {
  await db.from('users').truncate();
});

describe('POST /register', () => {
  it.todo('should return a 400 when missing a username or password');
  it.todo('should return a 201 when registering a user is successful');
  it.todo('should successfully register a new user');
});

describe('POST /login', () => {
  it.todo('should return a 200 when a user successfully logs in');
  it.todo('should return a token with the user\'s id when a user successfully logs in')
  it.todo('should return a 401 when the user provides invalide credenitals');
})