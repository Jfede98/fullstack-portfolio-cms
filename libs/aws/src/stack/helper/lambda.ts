import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export const ssmSyncPolicy = (
  region: string,
  accountId: string,
  keyPairId: string
) =>
  new PolicyStatement({
    actions: ["ssm:GetParameter"],
    resources: [
      `arn:aws:ssm:${region}:${accountId}:parameter/ec2/keypair/${keyPairId}`
    ]
  });

export const secretsManagerSyncPolicy = (
  region: string,
  accountId: string,
  infraSecretName: string
) =>
  new PolicyStatement({
    actions: [
      "secretsmanager:GetSecretValue",
      "secretsmanager:PutSecretValue",
      "secretsmanager:DescribeSecret"
    ],
    resources: [
      `arn:aws:secretsmanager:${region}:${accountId}:secret:${infraSecretName}-*`
    ]
  });
