import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { queryOne, queryAll, run, UserRecord, AuditLogRecord } from '../models/database.js';

function getClientIp(req: AuthenticatedRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || '127.0.0.1';
}

export function getAdminStats(req: AuthenticatedRequest, res: Response): void {
  const users = queryAll<UserRecord>('SELECT * FROM users');
  const activity = queryAll<{ status: string; action: string }>('SELECT status, action FROM login_activity');
  const alerts = queryAll<{ id: number }>('SELECT id FROM security_alerts WHERE status = "Active"');

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'Active').length;
  const suspendedUsers = users.filter((u) => u.status === 'Suspended').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  const totalLogins = activity.filter((a) => a.action === 'Successful login' || a.action === 'Failed login attempt').length;
  const successfulLogins = activity.filter((a) => a.status === 'Successful' && a.action === 'Successful login').length;
  const failedLogins = activity.filter((a) => a.status === 'Failed').length;

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      activeUsers,
      suspendedUsers,
      adminCount,
      totalLogins,
      successfulLogins,
      failedLogins,
      activeAlerts: alerts.length,
    },
  });
}

export function getUsers(req: AuthenticatedRequest, res: Response): void {
  const { search = '', role = '', status = '' } = req.query;

  let whereClauses: string[] = [];
  let params: any[] = [];

  if (role) {
    whereClauses.push('role = ?');
    params.push(String(role));
  }

  if (status) {
    whereClauses.push('status = ?');
    params.push(String(status));
  }

  if (search) {
    whereClauses.push('(name LIKE ? OR email LIKE ? OR username LIKE ?)');
    const searchTerm = `%${String(search).trim()}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // IMPORTANT: Never select password_hash!
  const users = queryAll<Omit<UserRecord, 'password_hash'>>(
    `SELECT id, name, email, username, role, status, verification_status, bio, department, phone, created_at, last_login
     FROM users ${whereSQL} ORDER BY id ASC`,
    params
  );

  const formattedUsers = users.map((u) => ({
    ...u,
    sdiId: `SDI-${String(u.id).padStart(6, '0')}`,
  }));

  res.status(200).json({
    success: true,
    users: formattedUsers,
  });
}

export function updateUserStatus(req: AuthenticatedRequest, res: Response): void {
  const admin = req.user!;
  const targetId = parseInt(req.params.id, 10);
  const { status } = req.body;

  if (isNaN(targetId)) {
    res.status(400).json({ success: false, message: 'Invalid user ID' });
    return;
  }

  if (status !== 'Active' && status !== 'Suspended') {
    res.status(400).json({ success: false, message: "Status must be either 'Active' or 'Suspended'" });
    return;
  }

  // Guardrail: Cannot suspend own active administrator account
  if (targetId === admin.id) {
    res.status(400).json({ success: false, message: 'You cannot change the status of your own account.' });
    return;
  }

  const targetUser = queryOne<UserRecord>('SELECT * FROM users WHERE id = ?', [targetId]);
  if (!targetUser) {
    res.status(404).json({ success: false, message: 'Target user account not found.' });
    return;
  }

  // Update status
  run('UPDATE users SET status = ? WHERE id = ?', [status, targetId]);

  // Log in administrative audit logs
  const ip = getClientIp(req);
  const now = new Date().toISOString();
  run(
    `INSERT INTO audit_logs (admin_id, admin_username, action, target_user_id, details, ip_address, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      admin.id,
      admin.username,
      'UPDATE_USER_STATUS',
      targetId,
      `Changed status of @${targetUser.username} (${targetUser.name}) to '${status}'`,
      ip,
      now
    ]
  );

  res.status(200).json({
    success: true,
    message: `Account status for ${targetUser.name} updated to ${status}.`,
  });
}

export function deleteUser(req: AuthenticatedRequest, res: Response): void {
  const admin = req.user!;
  const targetId = parseInt(req.params.id, 10);

  if (isNaN(targetId)) {
    res.status(400).json({ success: false, message: 'Invalid user ID' });
    return;
  }

  // Guardrail 1: Cannot delete self
  if (targetId === admin.id) {
    res.status(400).json({ success: false, message: 'You cannot delete your own active administrator account.' });
    return;
  }

  const targetUser = queryOne<UserRecord>('SELECT * FROM users WHERE id = ?', [targetId]);
  if (!targetUser) {
    res.status(404).json({ success: false, message: 'User account not found.' });
    return;
  }

  // Guardrail 2: Cannot delete the last administrator
  if (targetUser.role === 'admin') {
    const adminCount = queryAll<{ count: number }>('SELECT COUNT(*) as count FROM users WHERE role = "admin"')[0]?.count || 0;
    if (adminCount <= 1) {
      res.status(400).json({ success: false, message: 'Cannot delete the only remaining administrator in the system.' });
      return;
    }
  }

  // Delete user & log
  run('DELETE FROM users WHERE id = ?', [targetId]);

  const ip = getClientIp(req);
  const now = new Date().toISOString();
  run(
    `INSERT INTO audit_logs (admin_id, admin_username, action, target_user_id, details, ip_address, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      admin.id,
      admin.username,
      'DELETE_USER',
      targetId,
      `Permanently removed account @${targetUser.username} (${targetUser.name})`,
      ip,
      now
    ]
  );

  res.status(200).json({
    success: true,
    message: `User ${targetUser.name} was successfully removed.`,
  });
}

export function getAuditLogs(req: AuthenticatedRequest, res: Response): void {
  const logs = queryAll<AuditLogRecord>('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100');
  res.status(200).json({
    success: true,
    logs,
  });
}
