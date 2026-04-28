#!/bin/bash

set -e

export $(grep -v '^#' .env | xargs)

APP_NAME="strapi_$APP_STAGE"

echo "Iniciando instancia '$APP_NAME'..."
pm2 reload ecosystem.config.js --only="$APP_NAME"