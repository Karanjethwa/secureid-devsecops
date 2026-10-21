import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';

export const generalRateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs, // default 15 minutes
  max: config.rateLimitMax, // default 100 requests
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again later.',
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.authRateLimitMax, // default 10 attempts
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  skipSuccessfulRequests: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
});
