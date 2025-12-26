import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import chatRoutes from './routes/chat.routes';
import healthRoutes from './routes/health.routes';
import { logger } from './utils/logger';

export function createApp(): Application {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    })
  );

  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: false,
      maxAge: 86400,
    })
  );

  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  app.use((req, res, next) => {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;

      logger.info('HTTP Request', {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get('user-agent'),
      });
    });

    next();
  });

  app.get('/', (req, res) => {
    res.json({
      name: 'AI Support Agent API',
      version: env.API_VERSION,
      status: 'running',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/v1/health', healthRoutes);
  app.use('/api/v1/chat', chatRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
