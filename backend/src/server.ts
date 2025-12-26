import { createApp } from './app';
import { db } from './config/database';
import { redis } from './config/redis';
import { env } from './config/env';
import { logger } from './utils/logger';

const app = createApp();

let server: any;

async function startServer() {
  try {
    await db.connect();
    logger.info('Database connected successfully');

    await redis.connect();
    logger.info('Redis connected successfully');

    server = app.listen(env.PORT, () => {
      logger.info(`Server started successfully`, {
        port: env.PORT,
        env: env.NODE_ENV,
        version: env.API_VERSION,
      });
    });

    server.on('error', (error: Error) => {
      logger.error('Server error', { error });
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

async function gracefulShutdown(signal: string) {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');

      try {
        await db.disconnect();
        logger.info('Database connection closed');

        await redis.disconnect();
        logger.info('Redis connection closed');

        logger.info('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown', { error });
        process.exit(1);
      }
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection', {
    reason,
    promise,
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error });
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

startServer();

export { app };
