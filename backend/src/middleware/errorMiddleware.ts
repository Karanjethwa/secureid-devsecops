import { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error(`[ERROR] ${new Date().toISOString()} ${req.method} ${req.url}:`, err.message || err);

  const statusCode = err.statusCode || err.status || 500;
  const isProd = config.env === 'production';

  res.status(statusCode).json({
    success: false,
    message: isProd && statusCode === 500 ? 'An internal server error occurred.' : (err.message || 'Server error'),
    ...(isProd ? {} : { stack: err.stack }),
  });
}
