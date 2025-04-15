import { ZodSchema } from 'zod';
import { ValidationError } from '@domusjs/core/src/errors';

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
