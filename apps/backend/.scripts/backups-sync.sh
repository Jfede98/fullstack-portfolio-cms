#!/bin/bash
set -o pipefail

if [ -w "/var/log" ]; then
  LOG_FILE="/var/log/strapi-backups-sync-${APP_STAGE:-unknown}.log"
else
  LOG_FILE="/tmp/strapi-backups-sync-${APP_STAGE:-unknown}.log"
fi

MODE=${1:-"backup"} 
REMOTE_SYNC_IS_LOCAL=${2:-"false"}
REMOTE_SSH=$3
REMOTE_STAGE=$4
REMOTE_SYNC_S3_SOURCE=$5
REMOTE_SYNC_S3_DEST=$6
REMOTE_SYNC_CLOUDFRONT_SOURCE=$7
REMOTE_SYNC_CLOUDFRONT_DEST=$8

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
APP_DIR="$(dirname "$SCRIPT_DIR")"
ENV_PATH="$APP_DIR/.env"

if [ -f "$ENV_PATH" ]; then
  set -a
  source "$ENV_PATH"
  set +a
  echo "Configuración cargada desde $ENV_PATH" >> $LOG_FILE
else
  echo "Error: No se encontró el archivo .env en $ENV_PATH" >> $LOG_FILE
  exit 1
fi

S3_BUCKET_ORIGIN="s3://statics-xtrim-sitio-publico/backups/$APP_STAGE"
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
DB_BACKUP_PATH="/tmp/db_${DATABASE_NAME}_${TIMESTAMP}.sql.gz"

export PGPASSWORD=$DATABASE_PASSWORD

echo "[$(date '+%Y-%m-%d %H:%M:%S')] --- INICIO PROCESO EN MODO: $MODE ($APP_STAGE) ---" >> "$LOG_FILE"

/usr/bin/pg_dump -h ${DATABASE_HOST} -p ${DATABASE_PORT:-5432} -U $DATABASE_USERNAME $DATABASE_NAME | gzip > "$DB_BACKUP_PATH"

FILE_COMPRESSED="db_${DATABASE_NAME}_${TIMESTAMP}.sql.gz"
APP_TARBALL="/tmp/backup_strapi-${APP_STAGE}_${TIMESTAMP}.tar.gz"

mv "$DB_BACKUP_PATH" "$APP_DIR/$FILE_COMPRESSED"
cd "$APP_DIR"

if [ "$MODE" == "backup" ]; then
  tar -czf "$APP_TARBALL" --exclude='node_modules' --exclude='.env' .
  aws s3 cp "$APP_TARBALL" "$S3_BUCKET_ORIGIN/$(basename "$APP_TARBALL")"
  echo "Respaldo completado con éxito." >> $LOG_FILE

elif [ "$MODE" == "sync" ]; then

  if [ -z "$REMOTE_STAGE" ] || [ -z "$REMOTE_SYNC_S3_SOURCE" ] || [ -z "$REMOTE_SYNC_S3_DEST" ] || [ -z "$REMOTE_SYNC_CLOUDFRONT_SOURCE" ] || [ -z "$REMOTE_SYNC_CLOUDFRONT_DEST" ]; then
    echo "Error: Faltan argumentos para sync." >> $LOG_FILE
    exit 1
  fi

  echo ">>> Iniciando Sincronización <<<" >> $LOG_FILE
  tar -czf "$APP_TARBALL" --exclude='node_modules' --exclude='.env' .
  
  safe_old_cf=$(echo "$REMOTE_SYNC_CLOUDFRONT_SOURCE" | sed "s/'/''/g; s/;//g")
  safe_new_cf=$(echo "$REMOTE_SYNC_CLOUDFRONT_DEST" | sed "s/'/''/g; s/;//g")

  if [ "$REMOTE_SYNC_IS_LOCAL" = "true" ]; then
    
    TARGET_PATH="/home/ec2-user/app/$REMOTE_STAGE"

    echo "Copiando archivos localmente a $TARGET_PATH"
    cp "$APP_TARBALL" "$APP_DIR/$FILE_COMPRESSED" "$TARGET_PATH/"
    cd "$TARGET_PATH"

    echo ">>> PASO 1 (LOCAL): Iniciando limpieza y restauración <<<"
    FILE_TAR="$(basename "$APP_TARBALL")"
    FILE_SQL="$FILE_COMPRESSED"

    find . -maxdepth 1 ! -name "$FILE_TAR" ! -name "$FILE_SQL" ! -name ".env" ! -name "." -exec rm -rf {} +

    if [ -f ".env" ]; then
        set -a
        source .env
        set +a
    fi

    tar -xf "$FILE_TAR"

    echo ">>> Restaurando DB en RDS y aplicando Fix de URLs" >> $LOG_FILE
    export PGPASSWORD=$DATABASE_PASSWORD 
    psql -h "$DATABASE_HOST" -U "$DATABASE_USERNAME" -d "$DATABASE_NAME" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
    gunzip -c "$FILE_SQL" | psql -h "$DATABASE_HOST" -U "$DATABASE_USERNAME" -d "$DATABASE_NAME"
    psql -h "$DATABASE_HOST" -U "$DATABASE_USERNAME" -d "$DATABASE_NAME" -c "UPDATE files SET url = REPLACE(url, '$safe_old_cf', '$safe_new_cf'), formats = REPLACE(formats::text, '$safe_old_cf', '$safe_new_cf')::jsonb WHERE url LIKE '%$safe_old_cf%' OR formats::text LIKE '%$safe_old_cf%';"
    
    chmod -R +x ./.scripts
    bun install
    pm2 reload ecosystem.config.js --only="strapi_$REMOTE_STAGE"

    rm -f "$FILE_TAR" "$FILE_SQL" *.sql.gz
      
  else
    if [ -z "$REMOTE_SSH" ]; then
      echo "Error: Se requiere REMOTE_SSH para modo remoto." >> $LOG_FILE
      rm -f "$APP_DIR/$FILE_COMPRESSED" "$APP_TARBALL"
      exit 1
    fi

    TARGET_PATH="/home/ec2-user/app/$REMOTE_STAGE"

    echo "Enviando archivos al servidor remoto: $REMOTE_SSH..." >> $LOG_FILE
    rsync -avz -e "ssh -o StrictHostKeyChecking=no" "$APP_TARBALL" "$APP_DIR/$FILE_COMPRESSED" "ec2-user@$REMOTE_SSH:$TARGET_PATH/"

    echo ">>> PASO 1: Iniciando limpieza y restauración remota... <<<" >> $LOG_FILE
    ssh -o StrictHostKeyChecking=no "ec2-user@$REMOTE_SSH" << EOF
      cd $TARGET_PATH

      FILE_TAR="$(basename "$APP_TARBALL")"
      FILE_SQL="$FILE_COMPRESSED"

      # Aquí SI escapamos el \$ porque queremos que se evalúe en el servidor remoto
      find . -maxdepth 1 ! -name "\$FILE_TAR" ! -name "\$FILE_SQL" ! -name ".env" ! -name "." -exec rm -rf {} +

      if [ -f ".env" ]; then
          set -a
          source .env
          set +a
      fi

      tar -xf "\$FILE_TAR"

      echo ">>> Restaurando DB en RDS y aplicando Fix de URLs"
      export PGPASSWORD=\$DATABASE_PASSWORD 
      psql -h "\$DATABASE_HOST" -U "\$DATABASE_USERNAME" -d "\$DATABASE_NAME" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
      gunzip -c "\$FILE_SQL" | psql -h "\$DATABASE_HOST" -U "\$DATABASE_USERNAME" -d "\$DATABASE_NAME"
      echo ">>> Aplicando fix de URLs en la DB remota $safe_old_cf => $safe_new_cf"
      psql -h "\$DATABASE_HOST" -U "\$DATABASE_USERNAME" -d "\$DATABASE_NAME" \
        -c "UPDATE files SET \
          url = REPLACE(url, '$safe_old_cf', '$safe_new_cf'), 
          formats = REPLACE(formats::text, '$safe_old_cf', '$safe_new_cf')::jsonb \
          WHERE \
            url LIKE '%$safe_old_cf%' \
            OR formats::text LIKE '%$safe_old_cf%';"

      chmod -R +x ./.scripts
      bun install
      pm2 reload ecosystem.config.js --only="strapi_$REMOTE_STAGE"

      rm -f "\$FILE_TAR" "\$FILE_SQL" *.sql.gz
      exit
EOF
  fi

  echo ">>> PASO 2: Sincronizando assets en S3 <<< | s3://$REMOTE_SYNC_S3_SOURCE/ ==> s3://$REMOTE_SYNC_S3_DEST/" >> $LOG_FILE
  aws s3 sync "s3://$REMOTE_SYNC_S3_SOURCE/" "s3://$REMOTE_SYNC_S3_DEST/" --acl private
  echo "Paso 2 completado" >> $LOG_FILE

  echo "Sincronización completada con éxito." >> $LOG_FILE
fi

rm -f "$APP_DIR/$FILE_COMPRESSED"
rm -f "$APP_TARBALL"

sleep 6
echo "Proceso finalizado" >> $LOG_FILE