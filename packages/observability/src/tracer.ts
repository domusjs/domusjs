import { trace } from '@opentelemetry/api';

export const getTracer = (name: string) => trace.getTracer(name);
