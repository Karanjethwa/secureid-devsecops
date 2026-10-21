import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root or current directory
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config(); // fallback to current dir .env

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  frontendPort: parseInt(process.env.FRONTEND_PORT || '3000', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'secureid_dev_jwt_secret_change_in_production_key_2026_ciap',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  cookieSecret: process.env.COOKIE_SECRET || 'secureid_dev_cookie_secret_change_in_production_2026',
  databasePath: process.env.DATABASE_PATH || './data/secureid.sqlite',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 mins
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  authRateLimitMax: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '10', 10),
  suspiciousLoginThreshold: parseInt(process.env.SUSPICIOUS_LOGIN_THRESHOLD || '3', 10),
};
