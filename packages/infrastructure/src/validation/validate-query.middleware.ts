import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { fromZod } from './from-zod';

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = fromZod(schema).validate(req.query);
      (req.query as unknown) = parsed;
      next();
    } catch (err) {
      next(err);
    }
  };
}
