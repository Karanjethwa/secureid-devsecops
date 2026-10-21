import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { config } from './config/index.js';
import { generalRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import securityRoutes from './routes/securityRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

export function createApp(): Application {
  const app: Application = express();

  // Trust first proxy (e.g., Nginx, AWS ALB, Docker network)
  app.set('trust proxy', 1);

  // Security HTTP headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'blob:'],
          connectSrc: ["'self'", config.corsOrigin, 'http://localhost:3000', 'http://localhost:5000'],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  // Explicit CORS configuration
  app.use(
    cors({
      origin: [config.corsOrigin, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Cookie parser and request body parsers with payload size limits
  app.use(cookieParser(config.cookieSecret));
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));

  // General API Rate Limiting
  app.use('/api/', generalRateLimiter);

  // System Health Check Endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'UP',
      service: 'SecureID Digital Identity Management API',
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: config.env,
      database: 'SQLite (sql.js / zero native-addon build)',
      securityControls: [
        'Bcrypt Hashing (10 rounds)',
        'HTTP-only SameSite Cookies',
        'Express Rate Limiting',
        'Parameterized SQLite Queries',
        'RBAC Authorization Guards',
        'Helmet Security Headers',
      ],
    });
  });

  // API Routes
  app.use('/api', authRoutes);
  app.use('/api', userRoutes);
  app.use('/api', activityRoutes);
  app.use('/api', securityRoutes);
  app.use('/api', adminRoutes);

  // Serve static frontend build if it exists (for single-container production deployment)
  const clientDistPath = path.resolve(process.cwd(), '../frontend/dist');
  if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
    app.get('*', (req: Request, res: Response, next) => {
      if (req.path.startsWith('/api/')) {
        return next();
      }
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });
  }

  // 404 handler for API routes
  app.use('/api/*', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `API endpoint '${req.method} ${req.originalUrl}' not found.`,
    });
  });

  // Global Centralized Error Handler
  app.use(errorHandler);

  return app;
}
