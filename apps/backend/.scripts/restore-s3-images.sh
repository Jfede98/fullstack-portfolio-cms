#!/bin/bash

set -e

if [ -w "/var/log" ]; then
  LOG_FILE="/var/log/strapi-restore-s3-${APP_STAGE:-unknown}.log"
else
  LOG_FILE="/tmp/strapi-restore-s3-${APP_STAGE:-unknown}.log"
fi

echo "[$(date)] Iniciando restauración de imágenes en S3..." >> $LOG_FILE

# Cargar variables de entorno
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_DIR="$(dirname "$SCRIPT_DIR")"
ENV_PATH="$APP_DIR/.env"

if [ -f "$ENV_PATH" ]; then
  export $(grep -v '^#' "$ENV_PATH" | xargs)
fi

# Parámetros S3
BUCKET=$AWS_BUCKET
PREFIX=$AWS_S3_ROOT_PATH
PSQL_BIN="/opt/homebrew/opt/libpq/bin/psql"

if [ ! -f "$PSQL_BIN" ]; then
  PSQL_BIN=$(which psql)
fi

echo "Usando bucket: $BUCKET y prefijo: $PREFIX" >> $LOG_FILE

# Obtener todos los hashes de archivos desde la base de datos
echo "Consultando archivos en la base de datos..." >> $LOG_FILE

export PGPASSWORD=$DATABASE_PASSWORD
QUERY="SELECT hash || ext FROM files WHERE provider='aws-s3' OR provider='s3';"
FILES_IN_DB=$($PSQL_BIN -h ${DATABASE_HOST:-localhost} -p ${DATABASE_PORT:-5432} -U $DATABASE_USERNAME -d $DATABASE_NAME -t -A -c "$QUERY")

if [ -z "$FILES_IN_DB" ]; then
  echo "No se encontraron archivos en la base de datos para restaurar." >> $LOG_FILE
  exit 0
fi

echo "Se encontraron $(echo "$FILES_IN_DB" | wc -l) archivos en la base de datos." >> $LOG_FILE

# Listar todas las versiones en S3 que tienen un DeleteMarker como 'IsLatest'
echo "Buscando DeleteMarkers en S3..." >> $LOG_FILE
MARKERS_JSON=$(aws s3api list-object-versions --bucket "$BUCKET" --prefix "$PREFIX" --query 'DeleteMarkers[?IsLatest==`true`].{Key:Key,VersionId:VersionId}' --output json)

# Procesar y eliminar marcadores
echo "$MARKERS_JSON" | jq -c '.[]' | while read -r marker; do
    KEY=$(echo "$marker" | jq -r .Key)
    VERSION=$(echo "$marker" | jq -r .VersionId)
    
    FILENAME=$(basename "$KEY")
    
    if echo "$FILES_IN_DB" | grep -q "^$FILENAME$"; then
        echo "Restaurando archivo: $KEY (Version: $VERSION)" >> $LOG_FILE
        aws s3api delete-object --bucket "$BUCKET" --key "$KEY" --version-id "$VERSION"
    else
        echo "Omitiendo $KEY (No presente en la DB restaurada)" >> $LOG_FILE
    fi
done

echo "[$(date)] Proceso de restauración de S3 completado." >> $LOG_FILE
