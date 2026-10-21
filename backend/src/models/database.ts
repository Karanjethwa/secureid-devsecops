import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { hashPassword } from '../utils/hash.js';
import { config } from '../config/index.js';

let SQL: SqlJsStatic | null = null;
let db: Database | null = null;
let dbFilePath: string = '';

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  username: string;
  password_hash: string;
  role: 'admin' | 'user';
  status: 'Active' | 'Suspended';
  verification_status: 'Verified (Demo)' | 'Pending review' | 'Unverified';
  bio?: string;
  department?: string;
  phone?: string;
  created_at: string;
  last_login: string | null;
}

export interface LoginActivityRecord {
  id: number;
  user_id: number | null;
  identifier: string;
  action: string;
  details: string;
  status: 'Successful' | 'Failed';
  ip_address: string;
  user_agent: string;
  risk_level: 'Low' | 'Medium' | 'High';
  created_at: string;
}

export interface SecurityAlertRecord {
  id: number;
  user_id: number | null;
  alert_type: string;
  severity: 'info' | 'warning' | 'critical';
  description: string;
  source_ip: string;
  status: 'Active' | 'Resolved';
  created_at: string;
}

export interface AuditLogRecord {
  id: number;
  admin_id: number;
  admin_username: string;
  action: string;
  target_user_id: number | null;
  details: string;
  ip_address: string;
  created_at: string;
}

export async function initDatabase(): Promise<Database> {
  if (db) return db;

  SQL = await initSqlJs();

  // Resolve DB directory and file path
  dbFilePath = path.resolve(process.cwd(), config.databasePath);
  const dbDir = path.dirname(dbFilePath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  if (fs.existsSync(dbFilePath)) {
    const fileBuffer = fs.readFileSync(dbFilePath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables with parameterized schema definition
  migrateSchema(db);

  // Check and seed default data if users table is empty
  await seedDefaultData(db);

  saveDatabase();
  return db;
}

function migrateSchema(database: Database): void {
  database.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      status TEXT NOT NULL DEFAULT 'Active',
      verification_status TEXT NOT NULL DEFAULT 'Pending review',
      bio TEXT,
      department TEXT,
      phone TEXT,
      created_at TEXT NOT NULL,
      last_login TEXT
    );

    CREATE TABLE IF NOT EXISTS login_activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      identifier TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      status TEXT NOT NULL,
      ip_address TEXT NOT NULL,
      user_agent TEXT NOT NULL,
      risk_level TEXT NOT NULL DEFAULT 'Low',
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS security_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      alert_type TEXT NOT NULL,
      severity TEXT NOT NULL DEFAULT 'info',
      description TEXT NOT NULL,
      source_ip TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Active',
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_id INTEGER NOT NULL,
      admin_username TEXT NOT NULL,
      action TEXT NOT NULL,
      target_user_id INTEGER,
      details TEXT NOT NULL,
      ip_address TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (admin_id) REFERENCES users(id)
    );
  `);
}

async function seedDefaultData(database: Database): Promise<void> {
  const result = database.exec('SELECT COUNT(*) as count FROM users');
  const userCount = result[0]?.values[0]?.[0] as number || 0;

  if (userCount === 0) {
    const now = new Date().toISOString();
    const adminHash = await hashPassword('DemoAdmin123!');
    const userHash = await hashPassword('DemoUser123!');
    const aaravHash = await hashPassword('StudentAarav!26');
    const meeraHash = await hashPassword('StudentMeera!26');
    const riyaHash = await hashPassword('StudentRiya!26');

    // 1. Admin
    database.run(
      `INSERT INTO users (name, email, username, password_hash, role, status, verification_status, bio, department, phone, created_at, last_login)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Demo Administrator',
        'admin@demo.local',
        'admin_demo',
        adminHash,
        'admin',
        'Active',
        'Verified (Demo)',
        'DevSecOps Lab Administrator & Security Overseer',
        'Cybersecurity & Infrastructure',
        '+91 98200 12345',
        '2026-01-10T09:00:00.000Z',
        '2026-10-20T12:30:00.000Z'
      ]
    );

    // 2. Demo Student
    database.run(
      `INSERT INTO users (name, email, username, password_hash, role, status, verification_status, bio, department, phone, created_at, last_login)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Demo Student',
        'user@demo.local',
        'user_demo',
        userHash,
        'user',
        'Active',
        'Verified (Demo)',
        'Engineering Student · DevSecOps Lab Practicum',
        'Information Technology',
        '+91 98200 54321',
        '2026-01-15T10:15:00.000Z',
        '2026-10-20T14:15:00.000Z'
      ]
    );

    // 3. Aarav Mehta
    database.run(
      `INSERT INTO users (name, email, username, password_hash, role, status, verification_status, bio, department, phone, created_at, last_login)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Aarav Mehta',
        'aarav@example.demo',
        'aarav_demo',
        aaravHash,
        'user',
        'Active',
        'Verified (Demo)',
        'Cloud Security Researcher',
        'Computer Engineering',
        '+91 98111 22334',
        '2026-01-22T09:30:00.000Z',
        '2026-10-19T16:12:00.000Z'
      ]
    );

    // 4. Meera Shah
    database.run(
      `INSERT INTO users (name, email, username, password_hash, role, status, verification_status, bio, department, phone, created_at, last_login)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Meera Shah',
        'meera@example.demo',
        'meera_demo',
        meeraHash,
        'user',
        'Suspended',
        'Pending review',
        'Account suspended for policy demonstration',
        'Information Technology',
        '+91 98222 33445',
        '2026-01-28T13:10:00.000Z',
        '2026-10-15T11:48:00.000Z'
      ]
    );

    // 5. Riya Nair
    database.run(
      `INSERT INTO users (name, email, username, password_hash, role, status, verification_status, bio, department, phone, created_at, last_login)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Riya Nair',
        'riya@example.demo',
        'riya_demo',
        riyaHash,
        'user',
        'Active',
        'Verified (Demo)',
        'Identity & Access Management Intern',
        'Artificial Intelligence & Data Science',
        '+91 98333 44556',
        '2026-02-03T15:45:00.000Z',
        '2026-10-20T08:20:00.000Z'
      ]
    );

    // Seed Initial Login Activity
    const initialActivity = [
      {
        user_id: 1,
        identifier: 'admin_demo',
        action: 'Successful login',
        details: 'Authenticated with password and secure session cookie',
        status: 'Successful',
        ip_address: '192.168.1.10',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0',
        risk_level: 'Low',
        created_at: '2026-10-20T12:30:00.000Z',
      },
      {
        user_id: 2,
        identifier: 'user_demo',
        action: 'Successful login',
        details: 'Authenticated with standard credentials',
        status: 'Successful',
        ip_address: '192.168.1.15',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1',
        risk_level: 'Low',
        created_at: '2026-10-20T14:15:00.000Z',
      },
      {
        user_id: 2,
        identifier: 'user_demo',
        action: 'Failed login attempt',
        details: 'Incorrect password submitted for student account',
        status: 'Failed',
        ip_address: '10.0.4.88',
        user_agent: 'Mozilla/5.0 (X11; Linux x86_64) Firefox/128.0',
        risk_level: 'Medium',
        created_at: '2026-10-20T14:10:00.000Z',
      },
      {
        user_id: 4,
        identifier: 'meera_demo',
        action: 'Failed login attempt',
        details: 'Login denied: Account is currently suspended',
        status: 'Failed',
        ip_address: '198.51.100.42',
        user_agent: 'curl/7.88.1 (Simulated Automated Probe)',
        risk_level: 'High',
        created_at: '2026-10-15T11:48:00.000Z',
      },
      {
        user_id: 3,
        identifier: 'aarav_demo',
        action: 'Successful login',
        details: 'Routine developer session initialized',
        status: 'Successful',
        ip_address: '192.168.1.20',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/130.0',
        risk_level: 'Low',
        created_at: '2026-10-19T16:12:00.000Z',
      },
    ];

    for (const act of initialActivity) {
      database.run(
        `INSERT INTO login_activity (user_id, identifier, action, details, status, ip_address, user_agent, risk_level, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [act.user_id, act.identifier, act.action, act.details, act.status, act.ip_address, act.user_agent, act.risk_level, act.created_at]
      );
    }

    // Seed Initial Security Alert
    database.run(
      `INSERT INTO security_alerts (user_id, alert_type, severity, description, source_ip, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        4,
        'Suspicious Account Activity',
        'warning',
        'Suspended account login attempt detected from untrusted external IP address',
        '198.51.100.42',
        'Active',
        '2026-10-15T11:48:05.000Z'
      ]
    );

    // Seed Initial Audit Log
    database.run(
      `INSERT INTO audit_logs (admin_id, admin_username, action, target_user_id, details, ip_address, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        1,
        'admin_demo',
        'SYSTEM_INITIALIZED',
        null,
        'Initial SecureID digital identity system schema and seed data deployed',
        '127.0.0.1',
        now
      ]
    );
  }
}

export function saveDatabase(): void {
  if (!db || !dbFilePath) return;
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbFilePath, buffer);
  } catch (err) {
    console.error('Failed to persist SQLite database to disk:', err);
  }
}

export function queryAll<T = any>(sql: string, params: any[] = []): T[] {
  if (!db) throw new Error('Database not initialized');
  const stmt = db.prepare(sql);
  try {
    if (params.length > 0) {
      stmt.bind(params);
    }
    const results: T[] = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject() as unknown as T);
    }
    return results;
  } finally {
    stmt.free();
  }
}

export function queryOne<T = any>(sql: string, params: any[] = []): T | null {
  const all = queryAll<T>(sql, params);
  return all.length > 0 ? all[0] : null;
}

export function run(sql: string, params: any[] = []): { changes: number; lastInsertRowid: number } {
  if (!db) throw new Error('Database not initialized');
  db.run(sql, params);
  saveDatabase();

  const idRes = db.exec('SELECT last_insert_rowid() as id');
  const lastInsertRowid = (idRes[0]?.values[0]?.[0] as number) || 0;

  const changesRes = db.exec('SELECT changes() as changes');
  const changes = (changesRes[0]?.values[0]?.[0] as number) || 0;

  return { changes, lastInsertRowid };
}
