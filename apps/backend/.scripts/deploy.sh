#!/bin/bash
set -e

green='\e[1;32m'
cyan='\e[1;36m'
red='\e[1;31m'
yellow='\e[1;33m'
resetColor='\e[0m'

printf "${green}-------- BACKEND STRAPI DEPLOYMENT ---------${resetColor}\n\n"

## --- Validación de variables requeridas ---
if [[ -z "$ENVIRONMENT_INFRA_IAC" ]] || [[ -z "$ENVIRONMENT_SECRET" ]] || [[ -z "$ENVIRONMENT_DB" ]]; then
  echo -e "${red}✗ Error: Variables requeridas no configuradas${reset}"
  echo -e "${yellow}Configure en Harness: ENVIRONMENT_INFRA_IAC, ENVIRONMENT_SECRET, ENVIRONMENT_DB${reset}"
  exit 1
fi

SSH_SERVER_USER="ec2-user";
STAGE_ENV="$STAGE";
STRAPI_PORT="1337"

if [ "$STAGE" = "dev" ]; then
  STAGE_ENV="stg";
  STRAPI_PORT="1338"
fi

## Get environment variables
echo "Get environment variables | Current Stage Environment: $STAGE - $REGION"

## Get environment variables from infra_iac
SSH_SERVER_HOST="$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.EC2_PUBLIC_IP')"
CLOUDFRONT_URL="$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.CLOUDFRONT_ASSETS_ENDPOINT')"
AWS_BUCKET="$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.S3_BUCKET_NAME')"
SSH_PRIVATE_KEY_CONTENT="$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.EC2_SSH_PRIVATE_KEY')"
EC2_SG_ID="$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.EC2_SG')"
STRAPI_URL="$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.STRAPI_URL')"

AWS_S3_ROOT_PATH="$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.S3_ASSETS_FOLDER')"
AWS_S3_ROOT_PATH_DEV="$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.S3_ASSETS_FOLDER_DEV')"
AWS_S3_ROOT="$AWS_S3_ROOT_PATH"

## Get environment variables from db
DATABASE_HOST="$(echo "$ENVIRONMENT_DB" | jq -r '.host')"
DATABASE_CLIENT="$(echo "$ENVIRONMENT_DB" | jq -r '.engine')"
DATABASE_PORT="$(echo "$ENVIRONMENT_DB" | jq -r '.port')"
DATABASE_NAME="$(echo "$ENVIRONMENT_DB" | jq -r '.dbname')"
DATABASE_USERNAME="$(echo "$ENVIRONMENT_DB" | jq -r '.username')"
DATABASE_PASSWORD="$(echo "$ENVIRONMENT_DB" | jq -r '.password')"

DB_NAME="$DATABASE_NAME"

if [ "$STAGE" = "dev" ]; then
  AWS_S3_ROOT="$AWS_S3_ROOT_PATH_DEV"
  DB_NAME="$DATABASE_NAME-$STAGE"
fi

echo "$ENVIRONMENT_SECRET" > environment.json
## AWS format {SecretString: "..."} o JSON plano; falla si es null/inválido
jq -r '(if .SecretString then .SecretString | fromjson else . end) | to_entries | map("\(.key)=\"\(.value)\"") | .[]' environment.json > .env || { echo -e "${red}✗ ENVIRONMENT_SECRET inválido. Revisa el secreto en Harness.${reset}"; exit 1; }

cat >> .env <<EOF
SSH_SERVER_HOST="$SSH_SERVER_HOST"
CLOUDFRONT_URL="https://$CLOUDFRONT_URL"
AWS_BUCKET="$AWS_BUCKET"
AWS_S3_ROOT_PATH="$AWS_S3_ROOT"
PORT="$STRAPI_PORT"

DATABASE_HOST="$DATABASE_HOST"
DATABASE_CLIENT="$DATABASE_CLIENT"
DATABASE_PORT="$DATABASE_PORT"
DATABASE_NAME="$DB_NAME"

DATABASE_USERNAME="$DATABASE_USERNAME"
DATABASE_PASSWORD="$DATABASE_PASSWORD"

APP_STAGE="$STAGE"
NODE_ENV_PLUGIN="production"
EOF

set -a
. ./.env
set +a

cat .env

## Generate plugins
PROJECT_ROOT=$(pwd)
while [[ "$PROJECT_ROOT" != "/" && ! -f "$PROJECT_ROOT/nx.json" ]]; do
  PROJECT_ROOT=$(dirname "$PROJECT_ROOT")
done

echo "Raíz del proyecto detectada en: $PROJECT_ROOT"

PLUGINS_LIST=(
  "strapiRevalidate"
  "strapiSync"
  "strapiBackups"
)

mkdir -p "plugins"
for plugin in "${PLUGINS_LIST[@]}"; do
  DIST_PATH="$PROJECT_ROOT/libs/$plugin"
  
  if [ -d "$DIST_PATH" ]; then
    echo "Copiando plugin $plugin desde $DIST_PATH..."
    mkdir -p "plugins/$plugin"
    
    if [ -d "$DIST_PATH/dist" ]; then
        mkdir -p "plugins/$plugin/dist"
        cp -r "$DIST_PATH/dist"/* "plugins/$plugin/dist/" 2>/dev/null || cp -r "$DIST_PATH/dist" "plugins/$plugin/"
    else
        echo "El plugin $plugin no tiene carpeta /dist, usando rsync..."
        rsync -av --exclude="node_modules" --exclude=".turbo" "$DIST_PATH/" "plugins/$plugin/"
    fi
    cp "$DIST_PATH/package.json" "plugins/$plugin/" 2>/dev/null || echo "No package.json in $plugin"
  else
    echo "No se encontró la carpeta del plugin en: $DIST_PATH"
  fi
done

## Build strapi App
NODE_ENV=production && bun x nx build backend

## Comprimir archivos para la transferencia
echo "Verificando archivos para compresión..."

FILES_TO_PACK=(
  "plugins"
  "config"
  "dist"
  "public"
  "ecosystem.config.js"
  "favicon.png"
  "package.json"
  "tsconfig.json"
  ".strapi"
  ".scripts/pm2.sh"
  ".scripts/backups-sync.sh"
  ".scripts/restore-db.sh"
  ".scripts/restore-s3-images.sh"
  ".env"
)

EXISTING_FILES=()
for file in "${FILES_TO_PACK[@]}"; do
  if [ -e "$file" ]; then
    EXISTING_FILES+=("$file")
  else
    echo -e "${yellow} $file no encontrado, se omitirá del paquete.${resetColor}"
  fi
done

echo "Comprimiendo: ${EXISTING_FILES[*]}"
tar czvf build.tar.gz "${EXISTING_FILES[@]}" || {
  echo -e "${red}Error crítico al comprimir.${resetColor}"
  exit 1
}

## Configure SSH Access
echo "Configure SSH Access..."
mkdir -p ~/.ssh
chmod 700 ~/.ssh

if [ -z "$SSH_PRIVATE_KEY_CONTENT" ] || [ "$SSH_PRIVATE_KEY_CONTENT" = "null" ]; then
  echo -e "${red} Error: La llave privada SSH está vacía o es null. Revisar ENVIRONMENT_INFRA_IAC.${resetColor}"
  exit 1
fi

echo "$SSH_PRIVATE_KEY_CONTENT" > ~/.ssh/deploy_key
chmod 600 ~/.ssh/deploy_key

if [ -z "$SSH_SERVER_HOST" ] || [ "$SSH_SERVER_HOST" = "null" ]; then
    echo -e "${red} Error: SSH_SERVER_HOST no definido. No se puede hacer ssh-keyscan.${resetColor}"
    exit 1
fi

echo "Escaneando host: $SSH_SERVER_HOST"
ssh-keyscan -H "$SSH_SERVER_HOST" >> ~/.ssh/known_hosts 2>/dev/null || echo "Warning: keyscan falló, pero continuaremos..."

echo "SSH configurado correctamente."

## Change ownership 
ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no $SSH_SERVER_USER@$SSH_SERVER_HOST \
  "sudo chown -R $SSH_SERVER_USER:$SSH_SERVER_USER /home/$SSH_SERVER_USER/app && \
   sudo chmod -R 755 /home/$SSH_SERVER_USER/app"
   
## Transfer files to server
echo "Transfer files to server..."
rsync -avz \
  -e "ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no" \
  ./build.tar.gz $SSH_SERVER_USER@$SSH_SERVER_HOST:/home/$SSH_SERVER_USER/app/$STAGE/

## Execute SSH Commands on server
echo "Execute SSH Commands on server..."
ssh -tt -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no "$SSH_SERVER_USER@$SSH_SERVER_HOST" << EOF
  cd /home/$SSH_SERVER_USER/app/$STAGE
  rm -rf .strapi*
  find . -maxdepth 1 ! -name 'build.tar.gz' ! -name '.' ! -name 'node_modules' ! -name 'public' -exec rm -rf {} +
  tar xvf build.tar.gz
  find . -name '._*' -print -exec rm -rf {} +
  chmod -R +x ./.scripts

  # Install dependencies
  bun install
  bash ./.scripts/pm2.sh
  rm build.tar.gz
  
  # Swagger Config 
  echo "Copy generated swagger documentation to correct path"
  mkdir -p ./src/ && cp -r ./dist/src/extensions ./src/
  exit
EOF

URL_ENV="$STRAPI_URL";
echo "url: https://$URL_ENV"

if [ -n "$GITHUB_OUTPUT" ]; then
  echo "url=$URL_ENV" >> "$GITHUB_OUTPUT"
fi

echo "::notice:: $URL_ENV deployed successfully 🚀"