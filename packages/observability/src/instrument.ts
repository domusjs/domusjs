import { context, trace, SpanKind, SpanStatusCode, Tracer } from '@opentelemetry/api';

export function traceFn<T extends (...args: any[]) => any>(
  tracer: Tracer,
  spanName: string,
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args) => {
    const span = tracer.startSpan(spanName, { kind: SpanKind.INTERNAL });
    const fnContext = trace.setSpan(context.active(), span);

    const wrapped = () =>
      Promise.resolve(fn(...args))
        .then((result) => {
          span.setStatus({ code: SpanStatusCode.OK });
          return result;
        })
        .catch((err) => {
          span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
          span.recordException(err);
          throw err;
        })
        .finally(() => {
          span.end();
        });

    return context.with(fnContext, wrapped) as ReturnType<T>;
  };
}
