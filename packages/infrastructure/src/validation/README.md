# 🧪 Validation Module

This module provides a flexible and decoupled validation system using **Zod** by default, but it also allows you to plug in your own validation logic by implementing a simple `Validator` interface.

## 📦 Structure

```
/infrastructure/validation/
├── from-zod.ts                 # Adapts Zod to a standard Validator interface
├── validate-body.middleware.ts # Express middleware for body validation
├── validate-query.middleware.ts # Express middleware for query string validation
├── validate-params.middleware.ts # Express middleware for route params validation
├── index.ts                    # Exports everything in one place
```

---

## 🧩 The Validator Interface

You can implement your own validator by following this pattern:

```ts
export interface Validator<T = any> {
  validate(input: unknown): T;
}
```

Zod schemas are adapted using `fromZod`:

```ts
import { z } from 'zod';
import { fromZod } from './from-zod';

const schema = z.object({ id: z.string().uuid() });
const validator = fromZod(schema);
const result = validator.validate({ id: '123e4567-e89b-12d3-a456-426614174000' });
```

---

## 🚀 Usage Example (Express)

```ts
import { validateParams, validateQuery } from '@/infrastructure/validation';
import { z } from 'zod';

const GetUserParamsSchema = z.object({
  id: z.string().uuid(),
});

const GetUserQuerySchema = z.object({
  verbose: z.coerce.boolean().optional(),
});

router.get(
  '/users/:id',
  validateParams(GetUserParamsSchema),
  validateQuery(GetUserQuerySchema),
  (req, res) => {
    const { id } = req.params;
    const { verbose } = req.query;
    // ... your logic here
  }
);
```

> Note: We use `coerce` to safely convert query strings (like `?verbose=true`) into booleans or other expected types.

---

## 🛠️ Extendability

If you want to use another validation library (e.g. Yup, Joi), just implement your own adapter that matches the `Validator<T>` interface.
