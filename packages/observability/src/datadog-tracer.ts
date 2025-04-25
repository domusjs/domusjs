import ddTrace from 'dd-trace';

import { Tracer } from './tracer.interface';

const tracer = ddTrace.init();

export class DatadogTracer implements Tracer {
  async startSpan<T>(name: string, fn: () => Promise<T>): Promise<T> {
    return await tracer.trace(name, {}, fn);
  }
}
