// observability/src/logging/OpenTelemetryLogger.ts

import { injectable } from 'tsyringe';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { context, trace } from '@opentelemetry/api';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

import { Logger } from '../../../core/src';

@injectable()
export class OpenTelemetryLogger implements Logger {
  private logger;

  constructor(
    private readonly otelExporterURL: string = 'http://localhost:4318/v1/logs',
    private readonly serviceName: string = 'domusjs-app'
  ) {
    const exporter = new OTLPLogExporter({
      url: this.otelExporterURL,
    });

    const provider = new LoggerProvider({
      resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: this.serviceName,
      }),
      processors: [new SimpleLogRecordProcessor(exporter)],
    });

    this.logger = provider.getLogger(this.serviceName);
  }

  info(message: string, attributes: Record<string, any> = {}) {
    this.logger.emit({
      severityText: 'INFO',
      body: message,
      attributes: this.enrichWithTraceContext(attributes),
    });
  }

  warn(message: string, attributes: Record<string, any> = {}) {
    this.logger.emit({
      severityText: 'WARN',
      body: message,
      attributes: this.enrichWithTraceContext(attributes),
    });
  }

  error(message: string, attributes: Record<string, any> = {}) {
    this.logger.emit({
      severityText: 'ERROR',
      body: message,
      attributes: this.enrichWithTraceContext(attributes),
    });
  }

  debug(message: string, attributes: Record<string, any> = {}) {
    this.logger.emit({
      severityText: 'DEBUG',
      body: message,
      attributes: this.enrichWithTraceContext(attributes),
    });
  }

  private enrichWithTraceContext(attrs: Record<string, any>) {
    const span = trace.getSpan(context.active());
    if (span) {
      const spanCtx = span.spanContext();
      attrs['traceId'] = spanCtx.traceId;
      attrs['spanId'] = spanCtx.spanId;
    }
    return attrs;
  }
}
