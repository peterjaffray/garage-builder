#!/bin/sh

# Load environment variables if .env file exists
if [ -f /app/.env ]; then
    export $(cat /app/.env | grep -v '^#' | xargs)
fi

# Log environment variables (masking sensitive values)
echo "=== Garage Estimator Container Starting ==="
echo "Environment Configuration:"
echo "  PORT: ${PORT:-3000}"
echo "  SMTP_HOST: ${SMTP_HOST:-not set}"
echo "  SMTP_PORT: ${SMTP_PORT:-not set}"
echo "  SMTP_USER: ${SMTP_USER:-not set}"
echo "  SMTP_PASS: ${SMTP_PASS:+[REDACTED]}"
echo "  MAIL_FROM: ${MAIL_FROM:-not set}"
echo "  MAIL_TO: ${MAIL_TO:-not set}"
echo "  RECAPTCHA_SECRET: ${RECAPTCHA_SECRET:+[REDACTED]}"
echo "  VITE_BASE_URL: ${VITE_BASE_URL:-/}"
echo "  VITE_RECAPTCHA_SITE_KEY: ${VITE_RECAPTCHA_SITE_KEY:+[SET]}"
echo "=========================================="

# Start supervisord
exec /usr/bin/supervisord -c /etc/supervisord.conf