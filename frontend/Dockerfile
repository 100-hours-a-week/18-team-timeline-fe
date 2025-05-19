# 1️⃣ React 앱 빌드 (Node.js 사용)
FROM node:20-alpine AS builder

WORKDIR /app

# 종속성 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# 2️⃣ Nginx로 빌드 결과 서빙
FROM nginx:alpine

# 빌드된 정적 파일 복사
COPY --from=builder /app/build /usr/share/nginx/html

# Nginx 설정 파일 (필요 시 커스터마이징)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
