import { afterAll, beforeAll, vi } from 'vitest';

// Global test setup
beforeAll(() => {
  // Set up any global test configuration
  vi.setConfig({
    testTimeout: 10000,
  });
});

afterAll(() => {
  // Clean up any global resources
  vi.clearAllMocks();
});

// Global mocks that should be available in all tests
global.console = {
  ...console,
  // Uncomment to suppress console.log during tests
  // log: vi.fn(),
  // warn: vi.fn(),
  // error: vi.fn(),
}; 