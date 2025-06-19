# 👀 @domusjs/observability

The Observability Module in DomusJS provides a robust, plug-and-play integration with OpenTelemetry to enable:

- ✅ Distributed tracing
- ✅ Application-level metrics
- ✅ Centralized, traceable logging

It’s designed to give you deep visibility into your system’s behavior across commands, queries, events, jobs, and HTTP requests.


📘 **Documentation:** [@domusjs/observability Docs](https://docs.domusjs.com/modules/observability/observability-introduction/)

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
npm install @domusjs/observability @opentelemetry/exporter-trace-otlp-http
```


DomusJS provides a flexible observability layer built on top of OpenTelemetry. Depending on what parts of your application you want to instrument (e.g. HTTP server, PostgreSQL, Redis), you will need to install the corresponding OpenTelemetry instrumentation packages.

You can find the full list here:
👉 [OpenTelemetry Instrumentation Packages](https://www.npmjs.com/search?q=%40opentelemetry%2Finstrumentation)

For example:

```bash
npm install @opentelemetry/instrumentation-http @opentelemetry/instrumentation-express
```

---

## Basic Usage

### Setup the Tracer

```ts
import { setupObservability, getDefaultConfig } from '@domusjs/observability';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';

setupObservability({
  config: {
    ...getDefaultConfig('domusjs-app'),
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

✅ This initializes OpenTelemetry with your desired exporters and instrumentations.

---

### Use the @Traceable Decorator

The `@Traceable` decorator automatically creates a tracing span for a method, tracking execution time, attributes, and events.

```ts
import { Traceable } from '@domusjs/observability';

class UserService {
  @Traceable({ spanName: 'user.create' })
  async createUser(data: any) {
    // Logic here
  }
}
```

✅ Automatically creates spans when the decorated method is called.xw

---

## 🔗 Learn More

For advanced aspects, check out the full documentation:

👉 [https://docs.domusjs.com](https://docs.domusjs.com)
