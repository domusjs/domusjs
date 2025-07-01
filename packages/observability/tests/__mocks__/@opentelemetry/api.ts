import { vi } from 'vitest';

export const mockTrace = { getSpan: vi.fn() };
export const mockContext = { active: vi.fn() };

export const context = mockContext;
export const trace = mockTrace;
