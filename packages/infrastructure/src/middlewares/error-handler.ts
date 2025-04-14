import { Request, Response, NextFunction } from 'express';
import { BaseError } from '@domusjs/core/src/errors';

/**
 * Global Express error handler.
 * Converts known BaseErrors into clean HTTP responses.
 * Logs and masks unknown errors with a generic message.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // Unknown error
  console.error('Unhandled error:', err);

  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    },
  });
}
