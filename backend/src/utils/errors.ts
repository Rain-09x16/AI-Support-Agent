export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true,
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(400, message, true, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} not found: ${identifier}`
      : `${resource} not found`;
    super(404, message, true, { resource, identifier });
    this.name = 'NotFound';
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter: number, limit: number, window: string) {
    super(
      429,
      `Rate limit exceeded. Try again in ${retryAfter} seconds`,
      true,
      { retryAfter, limit, window }
    );
    this.name = 'RateLimitExceeded';
  }
}

export class LLMServiceError extends AppError {
  constructor(message: string, retriable = true) {
    super(502, message, true, { retriable });
    this.name = 'LLMServiceError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, originalError?: any) {
    super(503, 'Database operation failed', true, {
      message,
      originalError: originalError?.message,
    });
    this.name = 'DatabaseError';
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(service: string) {
    super(503, `${service} is temporarily unavailable`, true, { service });
    this.name = 'ServiceUnavailable';
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'An unexpected error occurred') {
    super(500, message, false);
    this.name = 'InternalServerError';
  }
}

export function isAppError(error: any): error is AppError {
  return error instanceof AppError;
}
