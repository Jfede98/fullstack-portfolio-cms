# !/bin/bash

set -e

echo "FRONTEND REMOVE DEPLOYMENT!!!"

# Get environment variables
echo "Get environment variables"
aws secretsmanager get-secret-value --secret-id $STAGE/xtrim-sp-frontend/environment --region $REGION > environment.json
jq -r '.SecretString | fromjson | to_entries | map("\(.key)=\"\(.value)\"") | .[]' environment.json > .env

# Deployment remove SST
echo "Deployment remove SST"
sst unlock --stage $STAGE
sst remove --stage $STAGE --print-logs