// STACK
export const AWS_STACK_NAME = process.env.AWS_STACK_NAME ?? "aws-stack";
export const REGION = process.env.AWS_REGION ?? "us-east-1";
export const AWS_STACK_OUTPUT_SECRETS_NAME =
  process.env.AWS_STACK_OUTPUT_SECRETS_NAME ?? "infra-outputs";

// VPC
export const VPC_ID = process.env.AWS_VPC_ID ?? "vpc_id";
export const VPC_NAME = process.env.AWS_VPC_NAME ?? "vpc_name";
export const VPC_CIDR_BLOCK = process.env.AWS_VPC_CIDR_BLOCK ?? "10.0.0.0/16";
export const VPC_NAT_GATEWAYS_NUMBER =
  process.env.AWS_VPC_NAT_GATEWAYS_NUMBER ?? 1;
export const VPC_DISPONIBLE_ZONES_NUMBER =
  process.env.AWS_PVC_DISPONIBLE_ZONES_NUMBER ?? 2;

// SUBNETS
export const PUBLIC_SUBNET_NAME =
  process.env.AWS_PUBLIC_SUBNET_NAME ?? "public_subnet";
export const PUBLIC_SUBNET_MASK = process.env.AWS_PUBLIC_SUBNET_MASK ?? 24;
export const PRIVATE_SUBNET_NAME =
  process.env.AWS_PRIVATE_SUBNET_NAME ?? "private_subnet";
export const PRIVATE_SUBNET_MASK = process.env.AWS_PRIVATE_SUBNET_MASK ?? 24;
export const ISOLATED_SUBNET_NAME =
  process.env.AWS_ISOLATED_SUBNET_NAME ?? "isolated_subnet";
export const ISOLATED_SUBNET_MASK = process.env.AWS_ISOLATED_SUBNET_MASK ?? 24;

// ASSETS STORAGE
export const AWS_ASSETS_STORAGE_NAME = process.env.AWS_ASSETS_STORAGE_NAME;
export const AWS_ASSETS_DOMAIN_NAME = process.env.AWS_ASSETS_DOMAIN_NAME;
export const AWS_ASSETS_CERTIFICATE_ARN =
  process.env.AWS_ASSETS_CERTIFICATE_ARN;

// EC2 INSTANCE
export const AWS_EC2_INSTANCE_NAME = process.env.AWS_EC2_INSTANCE_NAME;
export const AWS_EC2_INSTANCE_SSH_IPS = process.env.AWS_EC2_INSTANCE_SSH_IPS;
export const AWS_EC2_INSTANCE_HTTP_HTTPS_IPS =
  process.env.AWS_EC2_INSTANCE_HTTP_HTTPS_IPS;
export const AWS_EC2_INSTANCE_CLASS =
  process.env.AWS_EC2_INSTANCE_CLASS ?? "t3";
export const AWS_EC2_INSTANCE_SIZE =
  process.env.AWS_EC2_INSTANCE_SIZE ?? "micro";
export const AWS_EC2_INSTANCE_EIP = process.env.AWS_EC2_INSTANCE_EIP;
export const AWS_EC2_INSTANCE_GENERATE_NEW_ELASTIC_IP =
  process.env.AWS_EC2_INSTANCE_GENERATE_NEW_ELASTIC_IP ?? "false";
export const AWS_EC2_KEYPAIR_INSTANCE_NAME = process.env.AWS_EC2_KEYPAIR_INSTANCE_NAME ?? 
"KeyPair";
export const AWS_EC2_KEYPAIR_RESOURCE_NAME = process.env.AWS_EC2_KEYPAIR_RESOURCE_NAME?? "SyncKeyPairResourceV3";

// RDS INSTANCE
export const AWS_RDS_INSTANCE_CLASS =
  process.env.AWS_RDS_INSTANCE_CLASS ?? "t3";
export const AWS_RDS_INSTANCE_SIZE =
  process.env.AWS_RDS_INSTANCE_SIZE ?? "micro";

// WAF
export const AWS_WAF_INSTANCE_NAME = process.env.AWS_WAF_INSTANCE_NAME;
export const AWS_WAF_DESCRIPTION = process.env.AWS_WAF_DESCRIPTION ?? "WAF";
export const AWS_ACTIVE_WAF_RULES = process.env.AWS_ACTIVE_WAF_RULES ?? "true";