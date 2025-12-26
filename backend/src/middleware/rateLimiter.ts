import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis';
import { env } from '../config/env';
import { ErrorResponse } from '../types/api.types';

// Redis-backed rate limiting for production (persists across restarts and multiple instances)
export const chatRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    // @ts-expect-error - Redis client type compatibility
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: 'rl:chat:',
  }),
  handler: (req, res) => {
    const retryAfter = Math.ceil(env.RATE_LIMIT_WINDOW_MS / 1000);

    const errorResponse: ErrorResponse = {
      error: 'RateLimitExceeded',
      message: `Rate limit exceeded. Try again in ${retryAfter} seconds`,
      details: {
        retryAfter,
        limit: env.RATE_LIMIT_MAX_REQUESTS,
        window: '1 minute',
      },
      timestamp: new Date().toISOString(),
      path: req.path,
    };

    res.status(429).json(errorResponse);
  },
  skip: (req) => {
    return env.NODE_ENV === 'test';
  },
});

export const chatRateLimiterHourly = rateLimit({
  windowMs: 3600000,
  max: env.RATE_LIMIT_HOURLY_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    // @ts-expect-error - Redis client type compatibility
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: 'rl:hourly:',
  }),
  handler: (req, res) => {
    const retryAfter = 3600;

    const errorResponse: ErrorResponse = {
      error: 'RateLimitExceeded',
      message: 'Hourly rate limit exceeded. Try again later',
      details: {
        retryAfter,
        limit: env.RATE_LIMIT_HOURLY_MAX,
        window: '1 hour',
      },
      timestamp: new Date().toISOString(),
      path: req.path,
    };

    res.status(429).json(errorResponse);
  },
  skip: (req) => {
    return env.NODE_ENV === 'test';
  },
});

export const healthRateLimiter = rateLimit({
  windowMs: 60000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    // @ts-expect-error - Redis client type compatibility
    sendCommand: (...args: string[]) => redis.call(...args),
    prefix: 'rl:health:',
  }),
  skip: (req) => {
    return env.NODE_ENV === 'test';
  },
});
