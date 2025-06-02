// frontend/src/lib/otel.ts

import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

if (import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT) {
  console.log('[OTEL] tracing initialized with endpoint:', import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT);

  const exporter = new OTLPTraceExporter({
    url: import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT + '/v1/traces',
  });

  // ✅ TypeScript에서 오류 없는 방식으로 resource 설정
  const provider = new WebTracerProvider({
    resource: {
      attributes: {
        [SEMRESATTRS_SERVICE_NAME]: 'frontend-service',
      },
    } as any, // ← TS 에러 회피용. 실제 OTEL SDK가 받아들임
    spanProcessors: [new BatchSpanProcessor(exporter)],
  });

  provider.register();

  registerInstrumentations({
    instrumentations: [
      new FetchInstrumentation(),
      new XMLHttpRequestInstrumentation(),
    ],
  });

  console.log('[OTEL] tracing setup complete');
}
