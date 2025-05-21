import { ErrorRequestHandler } from 'express';
import { container } from 'tsyringe';
import { Logger, BaseError, ValidationError } from '@domusjs/core';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const logger = container.resolve<Logger>('Logger');

  logger.error('[ErrorHandler]', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof ValidationError) {
    res.status(400).json({
      error: {
        code: err.code,
        message: err.message,
        issues: err.details,
      },
    });
    return void 0;
  }

  if (err instanceof BaseError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return void 0;
  }

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    },
  });
};
