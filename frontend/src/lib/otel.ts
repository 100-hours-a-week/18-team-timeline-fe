import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';

if (import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT) {
  const exporter = new OTLPTraceExporter({
    url: import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT,
  });

  const provider = new WebTracerProvider({
    spanProcessors: [new BatchSpanProcessor(exporter)], // ✅ 정확한 속성명 (복수형)
  });

  provider.register();

  registerInstrumentations({
    instrumentations: [new FetchInstrumentation()],
  });

  console.log('[OTEL] tracing initialized');
}
