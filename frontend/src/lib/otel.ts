import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request'; // ✅ 추가

if (import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT) {
  console.log('[OTEL] tracing initialized with endpoint:', import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT);

  const exporter = new OTLPTraceExporter({
    url: import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT + '/v1/traces',
  });

  const provider = new WebTracerProvider({
    spanProcessors: [new BatchSpanProcessor(exporter)],
  });

  provider.register();

  registerInstrumentations({
    instrumentations: [
      new FetchInstrumentation(),
      new XMLHttpRequestInstrumentation(), //  axios 추적을 위한 필수 추가
    ],
  });

  console.log('[OTEL] tracing setup complete');
}
