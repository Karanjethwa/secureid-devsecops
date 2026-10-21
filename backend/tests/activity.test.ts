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

  const userRes = await request(app)
    .post('/api/login')
    .send({ identifier: 'user_demo', password: 'DemoUser123!' });
  userCookie = userRes.headers['set-cookie'][0];

  const adminRes = await request(app)
    .post('/api/login')
    .send({ identifier: 'admin_demo', password: 'DemoAdmin123!' });
  adminCookie = adminRes.headers['set-cookie'][0];
});

describe('Login Activity & Monitoring API Tests', () => {
  it('GET /api/activity - returns activity records for the authenticated user', async () => {
    const res = await request(app)
      .get('/api/activity')
      .set('Cookie', userCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.activity).toBeInstanceOf(Array);
    expect(res.body.pagination).toBeDefined();
  });

  it('GET /api/activity/:id - allows user to view their own activity item', async () => {
    const listRes = await request(app)
      .get('/api/activity')
      .set('Cookie', userCookie);

    const firstItem = listRes.body.activity[0];
    if (firstItem) {
      const res = await request(app)
        .get(`/api/activity/${firstItem.id}`)
        .set('Cookie', userCookie);

      expect(res.status).toBe(200);
      expect(res.body.activity.id).toBe(firstItem.id);
    }
  });

  it('GET /api/activity/:id - standard user receives 403 on another user record', async () => {
    // Event 1 belongs to admin (user_id = 1)
    const res = await request(app)
      .get('/api/activity/1')
      .set('Cookie', userCookie);

    // If event 1 doesn't belong to standard user (user_id 2), expect 403
    if (res.status !== 404) {
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    }
  });
});
