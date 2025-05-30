# ---------- Stage 1: Build ----------
# Node.js 경량 Alpine 이미지 사용
FROM node:22-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 소스 복사
COPY . .

# 의존성 설치 (package-lock.json 기준)
RUN npm ci

# 타입스크립트 컴파일 (tsconfig.json 기준)
RUN npx tsc -p tsconfig.json

# Vite로 빌드 (최종 결과물: dist/)
RUN npx vite build

# ---------- Stage 2: Serve ----------
# 경량 Nginx 이미지 사용
FROM nginx:alpine

# 기본 index.html 위치 정리
RUN rm -rf /usr/share/nginx/html/*

# 빌드된 정적 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# (옵션) SPA 대응 위해 nginx.conf도 커스텀 가능
COPY nginx.conf /etc/nginx/nginx.conf


# 80포트 오픈
EXPOSE 80

# SigNoz(OpenTelemetry)용 환경 변수 설정
ENV OTEL_EXPORTER_OTLP_ENDPOINT=$OTEL_EXPORTER_OTLP_ENDPOINT

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
