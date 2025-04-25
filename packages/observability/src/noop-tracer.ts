import { Tracer } from './tracer.interface';

export class NoopTracer implements Tracer {
  async startSpan<T>(_: string, fn: () => Promise<T>): Promise<T> {
    return fn();
  }
}
