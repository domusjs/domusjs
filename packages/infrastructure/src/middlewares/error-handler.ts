import { ErrorRequestHandler } from 'express';
import { container } from 'tsyringe';
import { Logger, BaseError, ValidationError } from '@domusjs/core';
import { SpanStatusCode, trace } from '@opentelemetry/api';

export const errorHandler: ErrorRequestHandler = (err, req, res, _) => {
  const logger = container.resolve<Logger>('Logger');

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

  logger.error('[ErrorHandler]', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const span = trace.getActiveSpan();

  if (span) {
    span.recordException(err);
    span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
  }

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
    },
  });
};
