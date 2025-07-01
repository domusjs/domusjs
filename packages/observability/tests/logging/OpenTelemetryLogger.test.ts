import { describe, it, expect, vi } from 'vitest';

import { OpenTelemetryLogger } from '../../src/logging/OpenTelemetryLogger';

// Simple mocks without complex hoisting
vi.mock('@opentelemetry/sdk-logs', () => ({
  LoggerProvider: vi.fn().mockImplementation(() => ({
    getLogger: vi.fn().mockReturnValue({ emit: vi.fn() }),
  })),
  SimpleLogRecordProcessor: vi.fn(),
}));

vi.mock('@opentelemetry/exporter-logs-otlp-http', () => ({
  OTLPLogExporter: vi.fn(),
}));

vi.mock('@opentelemetry/resources', () => ({
  resourceFromAttributes: vi.fn().mockReturnValue({}),
}));

vi.mock('@opentelemetry/semantic-conventions', () => ({
  ATTR_SERVICE_NAME: 'service.name',
}));

vi.mock('@opentelemetry/api', () => ({
  context: { active: vi.fn() },
  trace: { getSpan: vi.fn() },
}));

describe('OpenTelemetryLogger', () => {
  it('should be instantiable', () => {
    const logger = new OpenTelemetryLogger('http://test', 'test-service');
    expect(logger).toBeInstanceOf(OpenTelemetryLogger);
  });

  it('should have logging methods', () => {
    const logger = new OpenTelemetryLogger('http://test', 'test-service');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });
});
