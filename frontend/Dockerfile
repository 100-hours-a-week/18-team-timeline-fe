# ---------- Stage 1: Build ----------
FROM node:22-alpine AS builder

# Create app directory
WORKDIR /app

# Copy frontend source code
COPY . .

# Install dependencies and build
RUN npm ci && npm run build

# ---------- Stage 2: Serve ----------
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Custom Nginx config (uncomment if using your own)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port (default Nginx port)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
