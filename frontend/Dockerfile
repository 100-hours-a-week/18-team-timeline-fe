# ---------- Stage 1: Build ----------
FROM node:22-alpine AS builder

WORKDIR /app
COPY . .

# ✅ npx를 이용해 tsc, vite 실행 (command not found 방지)
RUN npm ci && npx tsc -p tsconfig.json || true && npx vite build

# ---------- Stage 2: Serve ----------
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
