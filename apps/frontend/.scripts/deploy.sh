#!/bin/bash
set -e

green='\e[1;32m'
cyan='\e[1;36m'
red='\e[1;31m'
yellow='\e[1;33m'
resetColor='\e[0m'

echo "frontend deployment script"
printf "$green-------- FRONTEND DEPLOYMENT!!! ---------$reset\n\n"

# --- Validación de variables requeridas ---
if [[ -z "$ENVIRONMENT_INFRA_IAC" ]] || [[ -z "$ENVIRONMENT_FRONTEND_SECRET" ]]; then
  echo -e "${red}✗ Error: Variables requeridas no configuradas${reset}"
  echo -e "${yellow}Configure en Harness: ENVIRONMENT_INFRA_IAC,ENVIRONMENT_FRONTEND_SECRET${reset}"
  exit 1
fi


# --- Determinar stage y nombre de app ---
if [ "$STAGE" = "dev" ]; then
  export PORT="1338"
  export SST_APP_NAME="xtrim-sp-front-dev"
  export AWS_S3_ROOT_PATH=$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.S3_ASSETS_FOLDER_DEV')
else
  export PORT="1337"
  export AWS_S3_ROOT_PATH=$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.S3_ASSETS_FOLDER')
  export SST_APP_NAME=$(echo "$ENVIRONMENT_FRONTEND_SECRET" | jq -r '.SST_APP_NAME')
fi

# --- Extraer variables de infraestructura ---
SST_REGION=$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.REGION')
SST_VPC_REGION=$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.REGION') 
EC2_PRIVATE_IP=$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.EC2_PRIVATE_IP')
PRIVATE_SUBNET=$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.PRIVATE_SUBNET_NAT')
EC2_SG=$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.EC2_SG')
CLOUDFRONT_SG=$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.CLOUDFRONT_FRONTEND_SG')
SST_ARN_WAF=$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.WAF_ARN')
SST_VPC_SECURITY_GROUPS="$CLOUDFRONT_SG"
SST_VPC_SUBNET_IDS="$PRIVATE_SUBNET"
SST_VPC_ID=$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.VPC_ID')
SITE_ORIGIN="http://$EC2_PRIVATE_IP:$PORT"
STRAPI_API_URL="http://$EC2_PRIVATE_IP:$PORT"
URL_STATIC_RESOURCES=$(echo "$ENVIRONMENT_INFRA_IAC" | jq -r '.CLOUDFRONT_ASSETS_ENDPOINT')

# --- Generar .env base ---
cat << EOF > .env
SST_APP_NAME="$SST_APP_NAME"
SST_VPC_ID="$SST_VPC_ID"
SITE_ORIGIN="$SITE_ORIGIN"
STRAPI_API_URL="$STRAPI_API_URL"
URL_STATIC_RESOURCES="$URL_STATIC_RESOURCES"
SST_VPC_SECURITY_GROUPS="$SST_VPC_SECURITY_GROUPS"
SST_VPC_SUBNET_IDS="$SST_VPC_SUBNET_IDS"
SST_REGION="$SST_REGION"
AWS_S3_ROOT_PATH="$AWS_S3_ROOT_PATH"
SST_STAGE="$STAGE"
EOF

# --- Parsear frontend_secrets ---
frontend_secrets=$(echo "$ENVIRONMENT_FRONTEND_SECRET" \
  | jq -r '(if .SecretString then .SecretString | fromjson else . end) 
           | to_entries | map("\(.key)=\(.value)") | .[]') \
  || { echo -e "${red}✗ ENVIRONMENT_FRONTEND_SECRET inválido${reset}"; exit 1; }

# --- Sobrescribir SST_APP_NAME en .env con el valor de la condicional ---
sed -i "s|^SST_APP_NAME=.*|SST_APP_NAME=\"$SST_APP_NAME\"|" .env

# --- Agregar el resto de los secretos (excepto SST_APP_NAME) ---
echo "$frontend_secrets" | grep -v '^SST_APP_NAME=' >> .env

# --- Exportar variables para el script ---
set -a
. ./.env
set +a

# --- Deployment SST ---
echo "Deployment SST"
cat .env

bun x sst unlock --stage "$STAGE" --print-logs
bun x sst deploy --stage "$STAGE" --print-logs
