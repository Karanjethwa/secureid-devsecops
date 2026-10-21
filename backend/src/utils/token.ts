import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { config } from '../config/index.js';

export interface TokenPayload {
  userId: number;
  email: string;
  username: string;
  role: 'admin' | 'user';
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, config.jwtSecret) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie('secureid_session', token, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: config.env === 'production' ? 'strict' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/',
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie('secureid_session', {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: config.env === 'production' ? 'strict' : 'lax',
    path: '/',
  });
}
