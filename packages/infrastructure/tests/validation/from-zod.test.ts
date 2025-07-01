import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { ValidationError } from '@domusjs/core';

import { fromZod } from '../../src/validation/from-zod';

describe('fromZod', () => {
  describe('successful validation', () => {
    it('should validate a simple string schema', () => {
      const schema = z.string();
      const validator = fromZod(schema);

      const result = validator.validate('test');

      expect(result).toBe('test');
    });

    it('should validate a number schema', () => {
      const schema = z.number();
      const validator = fromZod(schema);

      const result = validator.validate(42);

      expect(result).toBe(42);
    });

    it('should validate a boolean schema', () => {
      const schema = z.boolean();
      const validator = fromZod(schema);

      const result = validator.validate(true);

      expect(result).toBe(true);
    });

    it('should validate an object schema', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });
      const validator = fromZod(schema);

      const input = { name: 'John', age: 30 };
      const result = validator.validate(input);

      expect(result).toEqual(input);
    });

    it('should validate an array schema', () => {
      const schema = z.array(z.string());
      const validator = fromZod(schema);

      const input = ['a', 'b', 'c'];
      const result = validator.validate(input);

      expect(result).toEqual(input);
    });

    it('should validate a complex nested schema', () => {
      const schema = z.object({
        user: z.object({
          id: z.string(),
          profile: z.object({
            name: z.string(),
            email: z.string().email(),
          }),
        }),
        settings: z.array(
          z.object({
            key: z.string(),
            value: z.union([z.string(), z.number(), z.boolean()]),
          })
        ),
      });
      const validator = fromZod(schema);

      const input = {
        user: {
          id: '123',
          profile: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        },
        settings: [
          { key: 'theme', value: 'dark' },
          { key: 'notifications', value: true },
          { key: 'limit', value: 100 },
        ],
      };

      const result = validator.validate(input);

      expect(result).toEqual(input);
    });
  });

  describe('validation errors', () => {
    it('should throw ValidationError for invalid string', () => {
      const schema = z.string();
      const validator = fromZod(schema);

      expect(() => validator.validate(123)).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid number', () => {
      const schema = z.number();
      const validator = fromZod(schema);

      expect(() => validator.validate('not a number')).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid object', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });
      const validator = fromZod(schema);

      expect(() => validator.validate({ name: 'John' })).toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid email', () => {
      const schema = z.object({
        email: z.string().email(),
      });
      const validator = fromZod(schema);

      expect(() => validator.validate({ email: 'invalid-email' })).toThrow(ValidationError);
    });

    it('should include validation details in error', () => {
      const schema = z.object({
        name: z.string().min(3),
        age: z.number().min(18),
      });
      const validator = fromZod(schema);

      try {
        validator.validate({ name: 'ab', age: 16 });
        expect.fail('Should have thrown ValidationError');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).code).toBe('VALIDATION_ERROR');
        expect((error as ValidationError).details).toBeDefined();
      }
    });

    it('should handle null input', () => {
      const schema = z.string();
      const validator = fromZod(schema);

      expect(() => validator.validate(null)).toThrow(ValidationError);
    });

    it('should handle undefined input', () => {
      const schema = z.string();
      const validator = fromZod(schema);

      expect(() => validator.validate(undefined)).toThrow(ValidationError);
    });
  });

  describe('edge cases', () => {
    it('should handle empty string', () => {
      const schema = z.string();
      const validator = fromZod(schema);

      const result = validator.validate('');

      expect(result).toBe('');
    });

    it('should handle zero number', () => {
      const schema = z.number();
      const validator = fromZod(schema);

      const result = validator.validate(0);

      expect(result).toBe(0);
    });

    it('should handle empty object', () => {
      const schema = z.object({});
      const validator = fromZod(schema);

      const result = validator.validate({});

      expect(result).toEqual({});
    });

    it('should handle empty array', () => {
      const schema = z.array(z.string());
      const validator = fromZod(schema);

      const result = validator.validate([]);

      expect(result).toEqual([]);
    });

    it('should handle optional fields', () => {
      const schema = z.object({
        name: z.string(),
        email: z.string().email().optional(),
      });
      const validator = fromZod(schema);

      const result = validator.validate({ name: 'John' });

      expect(result).toEqual({ name: 'John' });
    });
  });
});
