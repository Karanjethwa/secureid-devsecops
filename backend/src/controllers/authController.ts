import { Request, Response } from 'express';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateToken, setAuthCookie, clearAuthCookie } from '../utils/token.js';
import { queryOne, queryAll, run, UserRecord } from '../models/database.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { config } from '../config/index.js';

function getSafeUser(user: UserRecord) {
  const { password_hash, ...safe } = user;
  return safe;
}

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || '127.0.0.1';
}

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, username, password } = req.body;
  const ip = getClientIp(req);
  const userAgent = req.headers['user-agent'] || 'Unknown';

  // Check uniqueness
  const existingEmail = queryOne<UserRecord>('SELECT id FROM users WHERE LOWER(email) = LOWER(?)', [email]);
  if (existingEmail) {
    res.status(409).json({
      success: false,
      message: 'That email address is already registered.',
    });
    return;
  }

  const existingUsername = queryOne<UserRecord>('SELECT id FROM users WHERE LOWER(username) = LOWER(?)', [username]);
  if (existingUsername) {
    res.status(409).json({
      success: false,
      message: 'That username is already taken.',
    });
    return;
  }

  const hashedPassword = await hashPassword(password);
  const now = new Date().toISOString();

  const insertResult = run(
    `INSERT INTO users (name, email, username, password_hash, role, status, verification_status, bio, department, created_at, last_login)
     VALUES (?, ?, ?, ?, 'user', 'Active', 'Pending review', '', 'General User', ?, NULL)`,
    [name, email, username, hashedPassword, now]
  );

  const newUserId = insertResult.lastInsertRowid;

  // Log activity
  run(
    `INSERT INTO login_activity (user_id, identifier, action, details, status, ip_address, user_agent, risk_level, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [newUserId, username, 'Account created', 'Digital identity registered successfully', 'Successful', ip, userAgent, 'Low', now]
  );

  res.status(201).json({
    success: true,
    message: 'Account created securely. You can now log in.',
    userId: newUserId,
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { identifier, password } = req.body;
  const ip = getClientIp(req);
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const now = new Date().toISOString();

  // Look up user by email or username
  const user = queryOne<UserRecord>(
    'SELECT * FROM users WHERE LOWER(email) = LOWER(?) OR LOWER(username) = LOWER(?)',
    [identifier, identifier]
  );

  if (!user) {
    // Record failed attempt for unknown identifier
    run(
      `INSERT INTO login_activity (user_id, identifier, action, details, status, ip_address, user_agent, risk_level, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [null, identifier, 'Failed login attempt', 'Unrecognized account identifier', 'Failed', ip, userAgent, 'Medium', now]
    );

    res.status(401).json({
      success: false,
      message: 'Invalid username/email or password.',
    });
    return;
  }

  // Check account status
  if (user.status !== 'Active') {
    run(
      `INSERT INTO login_activity (user_id, identifier, action, details, status, ip_address, user_agent, risk_level, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user.id, user.username, 'Failed login attempt', 'Account is suspended or locked', 'Failed', ip, userAgent, 'High', now]
    );

    res.status(403).json({
      success: false,
      message: 'Your account is currently suspended. Please contact the system administrator.',
    });
    return;
  }

  // Compare password hash
  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    run(
      `INSERT INTO login_activity (user_id, identifier, action, details, status, ip_address, user_agent, risk_level, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user.id, user.username, 'Failed login attempt', 'Incorrect password was submitted', 'Failed', ip, userAgent, 'Medium', now]
    );

    // Check failed attempts within last 15 minutes for brute force alert
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const recentFails = queryAll<{ count: number }>(
      `SELECT COUNT(*) as count FROM login_activity
       WHERE (user_id = ? OR identifier = ?) AND status = 'Failed' AND created_at >= ?`,
      [user.id, user.username, fifteenMinsAgo]
    );
    const failCount = recentFails[0]?.count || 0;

    if (failCount >= config.suspiciousLoginThreshold) {
      run(
        `INSERT INTO security_alerts (user_id, alert_type, severity, description, source_ip, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          user.id,
          'Brute Force Warning',
          'warning',
          `Multiple failed login attempts (${failCount}) recorded within 15 minutes.`,
          ip,
          'Active',
          now
        ]
      );
    }

    res.status(401).json({
      success: false,
      message: 'Invalid username/email or password.',
    });
    return;
  }

  // Successful login
  run('UPDATE users SET last_login = ? WHERE id = ?', [now, user.id]);

  run(
    `INSERT INTO login_activity (user_id, identifier, action, details, status, ip_address, user_agent, risk_level, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [user.id, user.username, 'Successful login', 'Authenticated with password and secure session', 'Successful', ip, userAgent, 'Low', now]
  );

  const token = generateToken({
    userId: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  });

  setAuthCookie(res, token);

  res.status(200).json({
    success: true,
    message: 'Signed in successfully.',
    token, // Also returned for client convenience/testing
    user: getSafeUser(user),
  });
}

export function logout(req: AuthenticatedRequest, res: Response): void {
  const ip = getClientIp(req);
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const now = new Date().toISOString();

  if (req.user) {
    run(
      `INSERT INTO login_activity (user_id, identifier, action, details, status, ip_address, user_agent, risk_level, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, req.user.username, 'Secure logout', 'Session terminated by user', 'Successful', ip, userAgent, 'Low', now]
    );
  }

  clearAuthCookie(res);

  res.status(200).json({
    success: true,
    message: 'Logged out securely.',
  });
}

export function getSession(req: AuthenticatedRequest, res: Response): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      user: null,
    });
    return;
  }

  res.status(200).json({
    success: true,
    user: getSafeUser(req.user),
  });
}
