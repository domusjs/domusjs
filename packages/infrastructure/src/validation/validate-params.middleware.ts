import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { fromZod } from './from-zod';

export function validateParams<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = fromZod(schema).validate(req.params);
      (req.params as unknown) = parsed;
      next();
    } catch (err) {
      next(err);
    }
  };
}
