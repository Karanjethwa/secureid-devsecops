import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/token.js';
import { queryOne, UserRecord } from '../models/database.js';

export interface AuthenticatedRequest extends Request {
  user?: UserRecord;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  // 1. Try to get token from HTTP-only cookie
  let token = req.cookies?.secureid_session;

  // 2. Fallback to Authorization: Bearer <token>
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please sign in to continue.',
    });
    return;
  }

  const payload: TokenPayload | null = verifyToken(token);
  if (!payload) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please sign in again.',
    });
    return;
  }

  // Fetch active user from database
  const user = queryOne<UserRecord>('SELECT * FROM users WHERE id = ?', [payload.userId]);
  if (!user) {
    res.status(401).json({
      success: false,
      message: 'User account not found. Please log in again.',
    });
    return;
  }

  if (user.status !== 'Active') {
    res.status(403).json({
      success: false,
      message: 'Account is currently suspended. Please contact the administrator.',
    });
    return;
  }

  req.user = user;
  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Forbidden. Administrator privileges required for this action.',
    });
    return;
  }
  next();
}
