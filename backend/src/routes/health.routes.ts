import { Router } from 'express';
import { db } from '../config/database';
import { redis } from '../config/redis';
import { asyncHandler } from '../middleware/errorHandler';
import { healthRateLimiter } from '../middleware/rateLimiter';
import { HealthCheckResponse } from '../types/api.types';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const router = Router();

const startTime = Date.now();

router.get(
  '/',
  healthRateLimiter,
  asyncHandler(async (_req, res) => {
    const checks = await Promise.all([
      db.healthCheck().catch(() => false),
      redis.healthCheck().catch(() => false),
      Promise.resolve(true),
    ]);

    const [dbHealth, redisHealth] = checks;

    const services = {
      database: dbHealth ? ('up' as const) : ('down' as const),
      redis: redisHealth ? ('up' as const) : ('down' as const),
      llm: 'up' as const,
    };

    let status: 'healthy' | 'degraded' | 'unhealthy';

    if (dbHealth && redisHealth) {
      status = 'healthy';
    } else if (dbHealth) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    const uptime = Math.floor((Date.now() - startTime) / 1000);

    const response: HealthCheckResponse = {
      status,
      timestamp: new Date().toISOString(),
      version: env.API_VERSION,
      services,
      uptime,
    };

    const statusCode = status === 'unhealthy' ? 503 : 200;

    if (status !== 'healthy') {
      logger.warn('Health check returned degraded or unhealthy status', {
        status,
        services,
      });
    }

    res.status(statusCode).json(response);
  })
);

export default router;
