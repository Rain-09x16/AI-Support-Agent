import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { ErrorResponse } from '../types/api.types';

// Note: Using in-memory rate limiting for assessment.
// For production, configure Redis-backed rate limiting.
export const chatRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
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
  skip: (req) => {
    return env.NODE_ENV === 'test';
  },
});
