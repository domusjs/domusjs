import { vi } from 'vitest';

export const loggerEmit = vi.fn();

export const LoggerProvider = vi.fn().mockImplementation(() => ({
  getLogger: vi.fn().mockReturnValue({ emit: loggerEmit }),
}));
export const SimpleLogRecordProcessor = vi.fn(); 