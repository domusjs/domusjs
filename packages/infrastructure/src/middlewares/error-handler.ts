import { Request, Response, NextFunction } from 'express';
import { BaseError } from '@domusjs/core/src/errors';
import { container } from 'tsyringe';
import { Logger } from '@domusjs/core/src/logger';

/**
 * Global Express error handler.
 * Converts known BaseErrors into clean HTTP responses.
 * Logs and masks unknown errors with a generic message.
 */
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  const logger = container.resolve<Logger>('Logger');

  logger.error('[ErrorHandler]', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    },
  });
}
