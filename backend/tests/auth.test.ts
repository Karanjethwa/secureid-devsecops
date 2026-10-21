import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { initDatabase } from '../src/models/database.js';

let app: any;

beforeAll(async () => {
  await initDatabase();
  app = createApp();
});

describe('Authentication & Identity Security API', () => {
  const testUser = {
    name: 'Test Student',
    email: `teststudent_${Date.now()}@example.demo`,
    username: `testuser_${Date.now()}`,
    password: 'SecurePassword123!',
    confirmPassword: 'SecurePassword123!',
  };

  it('POST /api/register - successfully creates a new digital identity', async () => {
    const res = await request(app)
      .post('/api/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('Account created securely');
  });

  it('POST /api/register - rejects duplicate email address', async () => {
    const res = await request(app)
      .post('/api/register')
      .send(testUser);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/register - rejects mismatched passwords', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        ...testUser,
        email: `another_${Date.now()}@example.demo`,
        username: `another_${Date.now()}`,
        confirmPassword: 'WrongPassword!',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Passwords do not match');
  });

  it('POST /api/login - successfully authenticates with valid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        identifier: 'user_demo',
        password: 'DemoUser123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.username).toBe('user_demo');
    // Critical security check: Never expose password_hash
    expect(res.body.user.password_hash).toBeUndefined();
    // Verify HTTP-only session cookie is set
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie'][0]).toContain('secureid_session');
    expect(res.headers['set-cookie'][0]).toContain('HttpOnly');
  });

  it('POST /api/login - returns safe generic 401 error on invalid password', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        identifier: 'user_demo',
        password: 'WrongPassword999!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid username/email or password.');
  });

  it('POST /api/login - returns safe generic 401 error on unknown user identifier', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        identifier: 'non_existent_account_12345',
        password: 'SomePassword123!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Invalid username/email or password.');
  });
});
