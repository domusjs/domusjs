import { ZodSchema } from 'zod';
import { ValidationError } from '@domusjs/core';

export function fromZod<T>(schema: ZodSchema<T>) {
  return {
    validate: (input: unknown): T => {
      const result = schema.safeParse(input);
      if (!result.success) {
        throw new ValidationError(result.error.message);
      }
      return result.data;
    },
  };
}
