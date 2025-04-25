import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

import { fromZod } from './from-zod';

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = fromZod(schema).validate(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
}
