import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { initDatabase } from '../src/models/database.js';

let app: any;
let userCookie: string;
let adminCookie: string;

beforeAll(async () => {
  await initDatabase();
  app = createApp();

  // Login standard user to acquire session cookie
  const userRes = await request(app)
    .post('/api/login')
    .send({ identifier: 'user_demo', password: 'DemoUser123!' });
  userCookie = userRes.headers['set-cookie'][0];

  // Login admin to acquire admin session cookie
  const adminRes = await request(app)
    .post('/api/login')
    .send({ identifier: 'admin_demo', password: 'DemoAdmin123!' });
  adminCookie = adminRes.headers['set-cookie'][0];
});

describe('Security & RBAC Enforcement Tests', () => {
  it('GET /api/health - returns 200 UP with active controls', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.securityControls).toBeInstanceOf(Array);
  });

  it('GET /api/admin/users - rejects unauthenticated access with 401', async () => {
    const res = await request(app).get('/api/admin/users');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/admin/users - rejects standard user with 403 Forbidden (RBAC)', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Cookie', userCookie);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Administrator privileges required');
  });

  it('GET /api/admin/users - allows authorized administrator with 200 OK', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Cookie', adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.users).toBeInstanceOf(Array);
    // Crucial DevSecOps assertion: No password hashes leaked
    res.body.users.forEach((u: any) => {
      expect(u.password_hash).toBeUndefined();
    });
  });

  it('POST /api/security/simulate-suspicious - creates simulated threat indicator', async () => {
    const res = await request(app)
      .post('/api/security/simulate-suspicious')
      .set('Cookie', userCookie);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.alertId).toBeDefined();
  });
});
