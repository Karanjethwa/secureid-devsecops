import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { queryOne, queryAll, run, UserRecord } from '../models/database.js';

export function getProfile(req: AuthenticatedRequest, res: Response): void {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const user = queryOne<UserRecord>('SELECT * FROM users WHERE id = ?', [req.user.id]);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  // Calculate user login statistics
  const stats = queryAll<{ status: string; count: number }>(
    `SELECT status, COUNT(*) as count FROM login_activity
     WHERE user_id = ? AND action IN ('Successful login', 'Failed login attempt')
     GROUP BY status`,
    [user.id]
  );

  let successfulLogins = 0;
  let failedLogins = 0;
  stats.forEach((s) => {
    if (s.status === 'Successful') successfulLogins = s.count;
    if (s.status === 'Failed') failedLogins = s.count;
  });

  const { password_hash, ...safeUser } = user;

  res.status(200).json({
    success: true,
    user: {
      ...safeUser,
      sdiId: `SDI-${String(user.id).padStart(6, '0')}`,
      stats: {
        totalLogins: successfulLogins + failedLogins,
        successfulLogins,
        failedLogins,
      },
    },
  });
}

export function updateProfile(req: AuthenticatedRequest, res: Response): void {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const { name, bio, department, phone } = req.body;
  const user = req.user;

  const newName = name !== undefined ? name : user.name;
  const newBio = bio !== undefined ? bio : (user.bio || '');
  const newDepartment = department !== undefined ? department : (user.department || '');
  const newPhone = phone !== undefined ? phone : (user.phone || '');

  run(
    `UPDATE users SET name = ?, bio = ?, department = ?, phone = ? WHERE id = ?`,
    [newName, newBio, newDepartment, newPhone, user.id]
  );

  const updatedUser = queryOne<UserRecord>('SELECT * FROM users WHERE id = ?', [user.id]);
  if (!updatedUser) {
    res.status(500).json({ success: false, message: 'Failed to retrieve updated profile' });
    return;
  }

  const { password_hash, ...safeUser } = updatedUser;

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    user: {
      ...safeUser,
      sdiId: `SDI-${String(updatedUser.id).padStart(6, '0')}`,
    },
  });
}
