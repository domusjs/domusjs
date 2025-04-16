import { RequestHandler } from 'express';
import { container } from 'tsyringe';
import { JWTService } from './jwt.service';
import { UnauthorizedError, InternalServerError } from '@domusjs/core/src/errors';

export const jwtAuthMiddleware: RequestHandler = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Unauthorized'));
  }

  const token = authHeader.split(' ')[1];

  const jwtService = container.resolve<JWTService>('JWTService');
  
  try {
    const user = jwtService.verify(token);
    (req as any).auth = user;
    next();
  } catch {
    next(new UnauthorizedError('Unauthorized'));
  }
};
