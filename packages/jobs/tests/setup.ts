import { afterAll, beforeAll, vi } from 'vitest';

beforeAll(() => {
  vi.setConfig({ testTimeout: 10000 });
});

afterAll(() => {
  vi.clearAllMocks();
});

global.console = {
  ...console,
  // log: vi.fn(),
  // warn: vi.fn(),
  // error: vi.fn(),
}; 