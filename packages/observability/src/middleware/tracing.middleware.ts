import { context, trace } from '@opentelemetry/api';
import { Request, Response, NextFunction } from 'express';

export const tracingMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const currentSpan = trace.getSpan(context.active());

  if (currentSpan) {
    currentSpan.setAttributes({
      'http.method': req.method,
      'http.url': req.url,
    });
  }

  next();
};
