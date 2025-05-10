import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import { UnauthorizedError } from '@domusjs/core';

import { JWTService } from './jwt.service';

export const jwtAuthMiddleware =
  <TPayload extends object = any>(): RequestHandler =>
  (req, _res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Unauthorized'));
    }

    const token = authHeader?.split(' ')[1];

    if (!token) {
      return next(new UnauthorizedError('Unauthorized'));
    }

    const jwtService = container.resolve<JWTService<TPayload>>('JWTService');

    try {
      const user = jwtService.verify(token);
      (req as unknown as Request & { auth: TPayload }).auth = user;
      next();
    } catch {
      next(new UnauthorizedError('Unauthorized'));
    }
  };
