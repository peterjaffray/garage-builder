# Multi-stage build for combined frontend and backend

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY frontend/ ./
ARG VITE_API_URL=/api
ARG VITE_RECAPTCHA_SITE_KEY
ARG VITE_BASE_URL=/
RUN VITE_BASE_URL=${VITE_BASE_URL} pnpm run build

# Stage 2: Build backend
FROM golang:1.21-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ ./
RUN go build -o server cmd/server/main.go

# Stage 3: Final runtime image
FROM alpine:latest
RUN apk add --no-cache ca-certificates nginx supervisor

# Create necessary directories
RUN mkdir -p /app /var/log/supervisor /run/nginx

# Copy backend binary
COPY --from=backend-builder /app/backend/server /app/server

# Copy frontend build to nginx directory
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy supervisor configuration
COPY supervisord.conf /etc/supervisord.conf

# Copy startup script
COPY startup.sh /app/startup.sh
RUN chmod +x /app/startup.sh

# Expose port 3000
EXPOSE 3000

# Start supervisor
CMD ["/app/startup.sh"]