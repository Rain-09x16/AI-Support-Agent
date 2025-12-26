import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, isAppError } from '../utils/errors';
import { ErrorResponse } from '../types/api.types';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export function errorHandler(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (isAppError(error)) {
    const errorResponse: ErrorResponse = {
      error: error.name,
      message: error.message,
      details: error.details,
      timestamp: new Date().toISOString(),
      path: req.path,
    };

    logger.error('Application error', {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });

    res.status(error.statusCode).json(errorResponse);
    return;
  }

  if (error instanceof ZodError) {
    const errorResponse: ErrorResponse = {
      error: 'ValidationError',
      message: 'Request validation failed',
      details: {
        errors: error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      },
      timestamp: new Date().toISOString(),
      path: req.path,
    };

    logger.warn('Validation error', {
      path: req.path,
      method: req.method,
      errors: error.errors,
    });

    res.status(400).json(errorResponse);
    return;
  }

  const errorResponse: ErrorResponse = {
    error: 'InternalServerError',
    message: env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : error.message,
    // Only expose stack trace in development
    ...(env.NODE_ENV !== 'production' && { stack: error.stack }),
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  logger.error('Unexpected error', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  res.status(500).json(errorResponse);
}

export function notFoundHandler(req: Request, res: Response): void {
  const errorResponse: ErrorResponse = {
    error: 'NotFound',
    message: `Route not found: ${req.method} ${req.path}`,
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  logger.warn('Route not found', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });

  res.status(404).json(errorResponse);
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
