import { createApp } from './app.js';
import { initDatabase, saveDatabase } from './models/database.js';
import { config } from './config/index.js';

async function bootstrap() {
  try {
    console.log('[INFO] Initializing SecureID SQLite Database...');
    await initDatabase();
    console.log('[SUCCESS] Database initialized and seeded with demo accounts.');

    const app = createApp();
    const server = app.listen(config.port, () => {
      console.log(`=======================================================`);
      console.log(`  SecureID — Secure Digital Identity Management System `);
      console.log(`  DevSecOps Lab CIAP Microproject API Server           `);
      console.log(`=======================================================`);
      console.log(`  Environment: ${config.env}`);
      console.log(`  Port:        ${config.port}`);
      console.log(`  Health:      http://localhost:${config.port}/api/health`);
      console.log(`  CORS:        ${config.corsOrigin}`);
      console.log(`=======================================================`);
    });

    const gracefulShutdown = (signal: string) => {
      console.log(`\n[INFO] Received ${signal}. Flushing database and shutting down gracefully...`);
      saveDatabase();
      server.close(() => {
        console.log('[INFO] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    console.error('[FATAL] Failed to start SecureID backend server:', error);
    process.exit(1);
  }
}

bootstrap();
