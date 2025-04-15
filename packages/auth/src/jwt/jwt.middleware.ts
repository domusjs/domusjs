import { RequestHandler } from 'express';
import { JWTService } from './jwt.service';
import { UnauthorizedError } from '@domusjs/core/src/errors';

export const jwtAuthMiddleware: RequestHandler = (req, res, next) => {

    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return next(new UnauthorizedError('Missing or invalid Authorization header'));
    }

    try {
        const user = JWTService.verify(token);
        (req as any).auth = user;
        next();
    } catch (err) {
        next(new UnauthorizedError('Invalid or expired token'));
    }
};
