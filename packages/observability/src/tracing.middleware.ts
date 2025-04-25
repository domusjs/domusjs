import { RequestHandler } from 'express';
import { container } from 'tsyringe';

import { Tracer } from './tracer.interface';

export const tracingMiddleware: RequestHandler = (req, res, next) => {
  const tracer = container.resolve<Tracer>('Tracer');

  tracer
    .startSpan(`http:${req.method} ${req.path}`, async () => {
      next();
    })
    .catch(next);
};
