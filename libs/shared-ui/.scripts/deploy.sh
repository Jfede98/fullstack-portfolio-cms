#!/bin/bash
set -e

green='\e[1;32m'
cyan='\e[1;36m'
red='\e[1;31m'
yellow='\e[1;33m'
resetColor='\e[0m'

printf "$green-------- STORYBOOK DEPLOYMENT!!! ---------$reset\n\n"

# --- Validación de variables requeridas ---
if [[ -z "$ENVIRONMENT_INFRA_IAC" ]]; then
  echo -e "${red}✗ Error: Variables requeridas no configuradas${reset}"
  echo -e "${yellow}Configure en Harness: ENVIRONMENT_INFRA_IAC ${reset}"
  exit 1
fi

AWS_BUCKET_PREFIX=$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.S3_STORYBOOK_FOLDER')
AWS_BUCKET_DEV=$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.S3_STORYBOOK_FOLDER_DEV')

# --- Determinar stage y nombre de app ---
if [ "$STAGE" = "dev" ]; then
  AWS_BUCKET="$AWS_BUCKET_DEV"
else
  AWS_BUCKET="$AWS_BUCKET_PREFIX"
fi

# --- Extraer variables de infraestructura ---
export AWS_BUCKET_NAME=$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.S3_BUCKET_NAME')
export AWS_CLOUDFRONT_DISTRIBUTION_ID=$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.CLOUDFRONT_ASSETS_DISTRIBUTION_ID')
export AWS_BUCKET_REGION=$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.REGION')
export DOMAIN_URL=$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.CLOUDFRONT_ASSETS_ENDPOINT')

# --- Generar .env base ---
cat << EOF > .env
REGION=$REGION
AWS_BUCKET_PREFIX=$AWS_BUCKET
AWS_BUCKET_NAME=$AWS_BUCKET_NAME
AWS_CLOUDFRONT_DISTRIBUTION_ID=$AWS_CLOUDFRONT_DISTRIBUTION_ID
AWS_BUCKET_REGION=$AWS_BUCKET_REGION
DOMAIN_URL=$DOMAIN_URL
STAGE=$STAGE
EOF

# --- Exportar variables para el script ---
set -a
. ./.env
set +a

# --- Deployment SST ---
echo "Deployment SST"
cat .env
pwd

bun ./deployment.ts
