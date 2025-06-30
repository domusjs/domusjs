import 'reflect-metadata';
import { vi } from 'vitest';

// Mock tsyringe container
vi.mock('tsyringe', () => ({
  container: {
    resolve: vi.fn(),
    register: vi.fn(),
  },
}));

// Mock jsonwebtoken
vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
  sign: vi.fn(),
  verify: vi.fn(),
}));

// Mock @domusjs/core
vi.mock('@domusjs/core', () => ({
  UnauthorizedError: class UnauthorizedError extends Error {
    constructor(message = 'Unauthorized') {
      super(message);
      this.name = 'UnauthorizedError';
    }
  },
}));

// Mock Express NextFunction
vi.mock('express', async () => {
  const actual = await vi.importActual('express');
  return {
    ...actual,
    NextFunction: vi.fn(),
  };
});
