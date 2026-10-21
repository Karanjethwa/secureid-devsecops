import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { initDatabase } from '../src/models/database.js';

let app: any;
let adminCookie: string;

beforeAll(async () => {
  await initDatabase();
  app = createApp();

  const adminRes = await request(app)
    .post('/api/login')
    .send({ identifier: 'admin_demo', password: 'DemoAdmin123!' });
  adminCookie = adminRes.headers['set-cookie'][0];
});

describe('Admin Management & Audit Logging Tests', () => {
  it('GET /api/admin/stats - returns system-wide identity metrics', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Cookie', adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.stats.totalUsers).toBeGreaterThanOrEqual(2);
    expect(res.body.stats.activeUsers).toBeGreaterThanOrEqual(1);
  });

  it('PUT /api/admin/users/:id/status - updates user account status and logs action', async () => {
    // Target user 3 (Aarav Mehta)
    const res = await request(app)
      .put('/api/admin/users/3/status')
      .set('Cookie', adminCookie)
      .send({ status: 'Suspended' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify audit log has recorded this modification
    const auditRes = await request(app)
      .get('/api/admin/audit-logs')
      .set('Cookie', adminCookie);

    expect(auditRes.status).toBe(200);
    const hasLog = auditRes.body.logs.some(
      (l: any) => l.action === 'UPDATE_USER_STATUS' && l.target_user_id === 3
    );
    expect(hasLog).toBe(true);

    // Revert status back to Active
    await request(app)
      .put('/api/admin/users/3/status')
      .set('Cookie', adminCookie)
      .send({ status: 'Active' });
  });

  it('PUT /api/admin/users/:id/status - prevents admin from suspending own account', async () => {
    // Admin is user 1
    const res = await request(app)
      .put('/api/admin/users/1/status')
      .set('Cookie', adminCookie)
      .send({ status: 'Suspended' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('cannot change the status of your own account');
  });

  it('DELETE /api/admin/users/:id - prevents admin from deleting own account', async () => {
    const res = await request(app)
      .delete('/api/admin/users/1')
      .set('Cookie', adminCookie);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
