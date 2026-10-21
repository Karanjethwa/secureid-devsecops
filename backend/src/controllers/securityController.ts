import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { queryOne, queryAll, run, SecurityAlertRecord, LoginActivityRecord } from '../models/database.js';

export function getSecurityStats(req: AuthenticatedRequest, res: Response): void {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const userId = req.user.id;
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Failed and successful logins in 24h
  const failed24h = queryAll<{ count: number }>(
    `SELECT COUNT(*) as count FROM login_activity
     WHERE user_id = ? AND action = 'Failed login attempt' AND created_at >= ?`,
    [userId, oneDayAgo]
  )[0]?.count || 0;

  const success24h = queryAll<{ count: number }>(
    `SELECT COUNT(*) as count FROM login_activity
     WHERE user_id = ? AND action = 'Successful login' AND created_at >= ?`,
    [userId, oneDayAgo]
  )[0]?.count || 0;

  // Active alerts
  const alertsCount = queryAll<{ count: number }>(
    `SELECT COUNT(*) as count FROM security_alerts
     WHERE (user_id = ? OR user_id IS NULL) AND status = 'Active'`,
    [userId]
  )[0]?.count || 0;

  // Implemented security controls
  const controls = [
    { name: 'Password Hashing', method: 'bcrypt (10 salt rounds)', status: 'Active', verified: true },
    { name: 'Session Protection', method: 'HTTP-only SameSite cookie', status: 'Active', verified: true },
    { name: 'Rate Limiting', method: 'Express Rate Limit (15 min window)', status: 'Active', verified: true },
    { name: 'Least-Privilege RBAC', method: 'Server-side Role Guard', status: 'Active', verified: true },
    { name: 'SQL Injection Defense', method: 'Parameterized SQLite Bindings', status: 'Active', verified: true },
    { name: 'Security Headers', method: 'Helmet (CSP, HSTS, Sniff-Guard)', status: 'Active', verified: true },
  ];

  res.status(200).json({
    success: true,
    stats: {
      failedLogins24h: failed24h,
      successfulLogins24h: success24h,
      activeAlerts: alertsCount,
      accountStatus: req.user.status,
      accessRole: req.user.role,
      controls,
    },
  });
}

export function getSecurityAlerts(req: AuthenticatedRequest, res: Response): void {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const isAdmin = req.user.role === 'admin';
  const alerts = isAdmin
    ? queryAll<SecurityAlertRecord>('SELECT * FROM security_alerts ORDER BY created_at DESC LIMIT 50')
    : queryAll<SecurityAlertRecord>(
        'SELECT * FROM security_alerts WHERE user_id = ? OR user_id IS NULL ORDER BY created_at DESC LIMIT 20',
        [req.user.id]
      );

  res.status(200).json({
    success: true,
    alerts,
  });
}

export function simulateSuspiciousLogin(req: AuthenticatedRequest, res: Response): void {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const now = new Date().toISOString();
  const simulatedIp = '198.51.100.77';

  // Record a simulated failed event
  run(
    `INSERT INTO login_activity (user_id, identifier, action, details, status, ip_address, user_agent, risk_level, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      req.user.id,
      req.user.username,
      'Failed login attempt',
      '[DEMO SIMULATION] Multiple rapid password guesses detected from anomalous IP',
      'Failed',
      simulatedIp,
      'Mozilla/5.0 (Kali Linux x86_64; Automated Security Scanner)',
      'High',
      now
    ]
  );

  // Generate a distinct simulated security alert
  const alertRes = run(
    `INSERT INTO security_alerts (user_id, alert_type, severity, description, source_ip, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      req.user.id,
      'SIMULATED: Suspicious Login Spike',
      'warning',
      `[SIMULATED LAB DEMO] 5 consecutive failed attempts from unverified geodiversity IP (${simulatedIp}). Triggered automated threshold flag.`,
      simulatedIp,
      'Active',
      now
    ]
  );

  res.status(201).json({
    success: true,
    message: 'Suspicious login scenario simulated successfully. Notice the updated risk score and alert feed.',
    alertId: alertRes.lastInsertRowid,
  });
}

export function getSecurityAnalysis(req: AuthenticatedRequest, res: Response): void {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const userId = req.user.id;
  const recentEvents = queryAll<LoginActivityRecord>(
    `SELECT * FROM login_activity WHERE user_id = ? ORDER BY created_at DESC LIMIT 100`,
    [userId]
  );

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).getTime();
  const eventsIn24h = recentEvents.filter((e) => new Date(e.created_at).getTime() >= oneDayAgo);
  const failedCount = eventsIn24h.filter((e) => e.status === 'Failed').length;
  const successCount = eventsIn24h.filter((e) => e.status === 'Successful').length;

  // Explainable deterministic risk score calculation
  let baseScore = 8;
  const failedPenalty = Math.min(failedCount * 18, 72);
  const roleFactor = req.user.role === 'admin' ? 5 : 0;
  const rawScore = Math.min(100, baseScore + failedPenalty + roleFactor);

  const riskLevel = rawScore < 30 ? 'Low' : rawScore < 65 ? 'Medium' : 'High';

  const findings = [
    {
      title: failedCount > 0 ? `${failedCount} failed login attempt${failedCount === 1 ? '' : 's'}` : 'No failed logins detected',
      detail: failedCount > 0
        ? 'Incorrect password attempts or simulated anomalies were recorded during the last 24 hours.'
        : 'Zero incorrect password attempts were recorded during the active observation window.',
      severity: failedCount > 2 ? 'warning' : 'safe',
    },
    {
      title: `Account status is ${req.user.status}`,
      detail: req.user.status === 'Active'
        ? 'Digital identity record is in good standing and accessible.'
        : 'Identity privileges are temporarily locked.',
      severity: req.user.status === 'Active' ? 'safe' : 'warning',
    },
    {
      title: `${req.user.role === 'admin' ? 'Privileged Administrator' : 'Standard User'} access role`,
      detail: req.user.role === 'admin'
        ? 'Administrator role grants elevated permissions requiring strict audit logging.'
        : 'Follows least-privilege principles with standard permissions.',
      severity: 'info',
    },
    {
      title: `${successCount} successful login${successCount === 1 ? '' : 's'} in 24 hours`,
      detail: 'Authentication frequency is consistent with expected classroom lab activity.',
      severity: 'info',
    },
  ];

  const recommendations = [
    failedCount > 0
      ? 'Inspect the login activity table for unfamiliar IP addresses and update password if necessary.'
      : 'Maintain unique, strong passphrases and do not reuse passwords across academic accounts.',
    req.user.role === 'admin'
      ? 'Use administrator access exclusively for maintenance tasks to uphold least privilege.'
      : 'Maintain standard user account for day-to-day work unless administration is required.',
    'Always click Secure Logout at the conclusion of every session to invalidate browser cookies.',
  ];

  res.status(200).json({
    success: true,
    analysis: {
      riskScore: rawScore,
      riskLevel,
      failedLogins: failedCount,
      successfulLogins: successCount,
      eventsAnalyzed: recentEvents.length,
      generatedAt: new Date().toISOString(),
      findings,
      recommendations,
    },
  });
}
