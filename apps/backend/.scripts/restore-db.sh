#!/bin/bash
set -e

if [ -w "/var/log" ]; then
  LOG_FILE="/var/log/strapi-restore-${APP_STAGE:-unknown}.log"
else
  LOG_FILE="/tmp/strapi-restore-${APP_STAGE:-unknown}.log"
fi

S3_URI=$1
if [ -z "$S3_URI" ]; then
  echo "Error: S3_URI es obligatorio" >> $LOG_FILE
  exit 1
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_DIR="$(dirname "$SCRIPT_DIR")"
ENV_PATH="$APP_DIR/.env"


if [ -f "$ENV_PATH" ]; then
  export $(grep -v '^#' "$ENV_PATH" | xargs)
else
  echo "Error: No se encontró .env" >> $LOG_FILE
  exit 1
fi

PM2_NAME=${PM2_APP_NAME:-"backend"}
TEMP_DIR="/tmp/restore_$$"
TAR_FILE="$TEMP_DIR/backup.tar.gz"


exec > >(tee -a ${LOG_FILE} )
exec 2> >(tee -a ${LOG_FILE} >&2)

echo "[$(date)] Empezando script de restauración para $S3_URI (Stage: $APP_STAGE)" >> $LOG_FILE

echo "Esperando 3 segundos para asegurar que la solicitud HTTP finalice correctamente..." >> $LOG_FILE
sleep 3

# Bajar todo
echo "Deteniendo proceso PM2: $PM2_NAME" >> $LOG_FILE
pm2 stop "$PM2_NAME" || true

# Descargar archivo
mkdir -p "$TEMP_DIR"
echo "Descargando backup desde S3..." >> $LOG_FILE
aws s3 cp "$S3_URI" "$TAR_FILE"

# Extraer backup
echo "Extrayendo el empaquetado en $TEMP_DIR" >> $LOG_FILE
tar -xzf "$TAR_FILE" -C "$TEMP_DIR"

# volcado SQL en la carpeta temporal
SQL_FILE=$(find "$TEMP_DIR" -name "*.sql.gz" | head -n 1)
PM2_FILE="$SCRIPT_DIR/pm2.sh"

if [ -z "$SQL_FILE" ]; then
  echo "Error: No se encontró ningún archivo .sql.gz en el backup extraído." >> $LOG_FILE
  bash "$PM2_FILE"
  rm -rf "$TEMP_DIR"
  exit 1
fi

# Restauración de BDD
echo "Preparando limpieza estricta (DROP SCHEMA) en $DATABASE_NAME..."
export PGPASSWORD=$DATABASE_PASSWORD

# borrar y recrear el esquema public. 
/usr/bin/psql -h ${DATABASE_HOST} -p ${DATABASE_PORT:-5432} -U $DATABASE_USERNAME -d $DATABASE_NAME -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO $DATABASE_USERNAME; GRANT ALL ON SCHEMA public TO public;"

echo "Inyectando backup $SQL_FILE sobre la base en blanco..." >> $LOG_FILE

# Inyectar .sql comprimido en la DB.
zcat "$SQL_FILE" | /usr/bin/psql -h ${DATABASE_HOST} -p ${DATABASE_PORT:-5432} -U $DATABASE_USERNAME $DATABASE_NAME

# Restaurar imágenes de S3 si tienen versionamiento (DeleteMarkers)
echo "Sincronizando imágenes borradas en S3..." >> $LOG_FILE
bash "$SCRIPT_DIR/restore-s3-images.sh" || echo "Aviso: Error en restauración parcial de imágenes S3 (continuando...)" >> $LOG_FILE

# Instalar dependencias
echo "Instalando dependencias..." >> $LOG_FILE
bun install

# Reiniciar Strapi
echo "Reiniciando Strapi en PM2 ($PM2_NAME)..." >> $LOG_FILE
bash "$PM2_FILE"

# Limpieza
echo "Limpieza profunda de temporales en $TEMP_DIR"
rm -rf "$TEMP_DIR"

echo "[$(date)] Restauración exitosa."
