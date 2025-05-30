import axios from 'axios'
import { API_BASE_URL } from '@/constants/url'


// OTEL Web SDK 관련 의존성

import { WebTracerProvider } from '@opentelemetry/sdk-trace-web'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch'



// 2. OTEL 환경 변수 기반 초기화 로그 출력
if (import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT) {
  const provider = new WebTracerProvider()

  provider.addSpanProcessor(
    new BatchSpanProcessor(
      new OTLPTraceExporter({
        url: import.meta.env.VITE_OTEL_EXPORTER_OTLP_ENDPOINT,
      })
    )
  )

  provider.register()

  registerInstrumentations({
    instrumentations: [
      new FetchInstrumentation({
        ignoreUrls: [/localhost/, /127\.0\.0\.1/], // 옵션: 개발 중 로컬 요청 무시
      }),
    ],
  })


export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})
