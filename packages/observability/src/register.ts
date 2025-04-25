import { container } from 'tsyringe';
import { Tracer } from './tracer.interface';
import { DatadogTracer } from './datadog-tracer';
import { NoopTracer } from './noop-tracer';

export function registerObservabilityModule() {
  const ddEnabled = process.env.DD_TRACE_ENABLED === 'true';

  container.register<Tracer>('Tracer', {
    useClass: ddEnabled ? DatadogTracer : NoopTracer,
  });
}
