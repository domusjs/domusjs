
# 📊 DomusJS - Observability Module

> Observability and distributed tracing module for DomusJS, powered by OpenTelemetry.

This package provides a modular, plug-and-play observability layer for backend systems, offering:
- **Tracing** across commands, queries, events, jobs, and HTTP requests.
- **Instrumentation hooks** (Express, Prisma, BullMQ, etc.).
- **Exporters** to popular backends like Signoz, Datadog, Jaeger.
- **Logger integration** to propagate trace context inside your logs.
- **Full type safety** to extend and configure as you need.

---

## ✨ Features

- 🎯 **OpenTelemetry Tracer** setup and initialization.
- 🛠️ **Manual instrumentation helpers** (`traceFn`, `@Traceable()` decorator).
- 🌍 **Pluggable exporters** (OTLP, Jaeger, Console).
- 🔍 **Logger enrichment** with trace and span IDs.
- 📈 **Metrics + Logs** (ready to extend, including OTLP log export).
- 🔩 **Custom instrumentations** for third-party libraries.

---

## 🚀 Getting Started

### Install

```bash
npm install @domusjs/observability @opentelemetry/api
```

---

### Basic Setup

```ts
import { setupObservability, getDefaultConfig } from '@domusjs/observability';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

setupObservability({
  config: {
    ...getDefaultConfig('my-service'),
    traceExporter: new OTLPTraceExporter({
      url: 'http://localhost:4318/v1/traces',
    }),
  },
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
  ],
});
```

✅ This sets up tracing and instrumentation for HTTP + Express, sending data to an OTLP-compatible backend like Signoz or Datadog.

---

## 🌟 Usage Examples

### Trace a Function Manually

```ts
import { traceFn } from '@domusjs/observability';

await traceFn('my-operation', async (span) => {
  span.setAttribute('custom.attribute', 'value');
  // ... your logic here
});
```

---

### Use the `@Traceable()` Decorator

```ts
import { Traceable } from '@domusjs/observability';

class VideoProcessor {
  @Traceable()
  async processVideo(videoId: string) {
    // This method is automatically wrapped in a tracing span
  }
}
```

---

## 🔌 Advanced: Logger Integration

You can use the provided `OpenTelemetryLogger` to automatically enrich logs with trace context:

```ts
import { OpenTelemetryLogger } from '@domusjs/observability';
import { container } from 'tsyringe';

const openTelemetryLogger = new OpenTelemetryLogger(
  'http://localhost:4318/v1/logs',
  'my-service'
);

registerDomusCore({
  logger: openTelemetryLogger,
});

const logger = container.resolve('Logger');
logger.info('My log message', { additional: 'context' });
```

✅ This will include `traceId` and `spanId` in your logs for easy correlation.

---

## 🌍 Supported Exporters

| Exporter            | Package                                     | Use Case                               |
|---------------------|--------------------------------------------|----------------------------------------|
| OTLP (HTTP)         | `@opentelemetry/exporter-trace-otlp-http`  | Signoz, Datadog, Lightstep, etc.       |
| Jaeger              | `@opentelemetry/exporter-jaeger`           | Jaeger backend                         |
| Console (dev)       | `@opentelemetry/sdk-trace-base`            | Local debug, development only          |

---

## 🛠 Configuration Tips

- **Service name:** Set in `getDefaultConfig('my-service')`.
- **Sampling:** By default uses `AlwaysOnSampler`; you can customize it.
- **Instrumentations:** Add more (e.g., `PrismaInstrumentation`, `BullMQInstrumentation`) as needed.
- **Context propagation:** Automatically wired with Express, but extend manually in other layers.

---

## 🧩 Extensibility

This module is designed to be:
- Plug-and-play inside DomusJS.
- Extendable with custom spans, attributes, or resources.
- Ready for integration with OpenTelemetry metrics and logs.
