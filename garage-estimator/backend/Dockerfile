# Multi-stage Dockerfile supporting both development and production

FROM golang:1.21-alpine AS base

WORKDIR /app

# Install air for development hot reloading (compatible with Go 1.21)
RUN go install github.com/cosmtrek/air@v1.49.0

# Copy go mod files
COPY go.mod ./
COPY go.su[m] ./

# Download dependencies
RUN go mod download && go mod verify

# Copy source code
COPY . .

# Development stage
FROM base AS development
EXPOSE 3000
CMD ["air", "-c", "air.conf"]

# Production build stage
FROM base AS builder
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/server

# Production stage
FROM alpine:latest AS production
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
EXPOSE 3000
CMD ["./main"] 