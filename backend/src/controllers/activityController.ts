import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { queryOne, queryAll, LoginActivityRecord } from '../models/database.js';

export function getActivityList(req: AuthenticatedRequest, res: Response): void {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const { search = '', status = 'all', page = '1', limit = '15', all = 'false' } = req.query;

  const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 15));
  const offset = (pageNum - 1) * limitNum;

  const isAdmin = req.user.role === 'admin';
  const showAll = isAdmin && String(all) === 'true';

  let whereClauses: string[] = [];
  let params: any[] = [];

  if (!showAll) {
    whereClauses.push('user_id = ?');
    params.push(req.user.id);
  }

  if (status && status !== 'all') {
    whereClauses.push('status = ?');
    params.push(String(status));
  }

  if (search) {
    whereClauses.push('(identifier LIKE ? OR action LIKE ? OR ip_address LIKE ? OR details LIKE ?)');
    const searchTerm = `%${String(search).trim()}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Get total count
  const countRes = queryAll<{ count: number }>(
    `SELECT COUNT(*) as count FROM login_activity ${whereSQL}`,
    params
  );
  const total = countRes[0]?.count || 0;

  // Get items
  const items = queryAll<LoginActivityRecord>(
    `SELECT * FROM login_activity ${whereSQL} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, limitNum, offset]
  );

  res.status(200).json({
    success: true,
    activity: items,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
}

export function getActivityById(req: AuthenticatedRequest, res: Response): void {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ success: false, message: 'Invalid activity ID' });
    return;
  }

  const item = queryOne<LoginActivityRecord>('SELECT * FROM login_activity WHERE id = ?', [id]);
  if (!item) {
    res.status(404).json({ success: false, message: 'Activity record not found' });
    return;
  }

  // Least-privilege check: Standard users can only view their own activity
  if (req.user.role !== 'admin' && item.user_id !== req.user.id) {
    res.status(403).json({ success: false, message: 'Access denied to this record' });
    return;
  }

  res.status(200).json({
    success: true,
    activity: item,
  });
}
