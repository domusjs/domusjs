import {
    context,
    trace,
    SpanKind,
    SpanStatusCode,
    Tracer,
    Span,
} from '@opentelemetry/api';

type TraceableOptions = {
    spanName?: string;
    attributes?: (args: any[]) => Record<string, string | number | boolean>;
    logEvent?: string | ((args: any[]) => string);
    resultAttributes?: (result: any) => Record<string, string | number | boolean>;
    resultEvent?: (result: any) => string;
};

export function Traceable(tracer: Tracer, options: TraceableOptions = {}): MethodDecorator {
    return function (
        target,
        propertyKey,
        descriptor: PropertyDescriptor
    ): PropertyDescriptor {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const spanName =
                options.spanName ?? `${target.constructor.name}.${String(propertyKey)}`;
            const span = tracer.startSpan(spanName, { kind: SpanKind.INTERNAL });
            const fnContext = trace.setSpan(context.active(), span);

            // Set argument-based attributes
            const attrs = options.attributes?.(args);
            if (attrs) {
                for (const [key, value] of Object.entries(attrs)) {
                    span.setAttribute(key, value);
                }
            }

            // Add event before execution
            if (options.logEvent) {
                const event =
                    typeof options.logEvent === 'function'
                        ? options.logEvent(args)
                        : options.logEvent;
                span.addEvent(event);
            }

            const wrapped = () =>
                Promise.resolve(originalMethod.apply(this, args))
                    .then((result) => {
                        // Add result-based attributes
                        const resultAttrs = options.resultAttributes?.(result);
                        if (resultAttrs) {
                            for (const [key, value] of Object.entries(resultAttrs)) {
                                span.setAttribute(key, value);
                            }
                        }

                        // Add result-based event
                        const resultEvent = options.resultEvent?.(result);
                        if (resultEvent) {
                            span.addEvent(resultEvent);
                        }

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

            return context.with(fnContext, wrapped);
        };

        return descriptor;
    };
}
