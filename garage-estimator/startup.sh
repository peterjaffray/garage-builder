#!/bin/sh

# Load environment variables if .env file exists
if [ -f /app/.env ]; then
    export $(cat /app/.env | grep -v '^#' | xargs)
fi

# Start supervisord
exec /usr/bin/supervisord -c /etc/supervisord.conf