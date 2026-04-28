import { InstanceClass, InstanceSize } from "aws-cdk-lib/aws-ec2";
import type { Resources } from "../constants/enums";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export const parseInstanceClass = (
  r: Resources,
  value?: string
): InstanceClass => {
  if (!value) throw new Error(`${r} instance class is required`);

  const key = value.toLowerCase();

  const instances: Record<string, InstanceClass> = {
    t3: InstanceClass.T3,
    t3a: InstanceClass.T3A,
    t2: InstanceClass.T2,
    m5: InstanceClass.M5,
    t4g: InstanceClass.T4G,
    c5: InstanceClass.C5,
    c6g: InstanceClass.C6G,
    c6gd: InstanceClass.C6GD,
    m6g: InstanceClass.M6G,
    r6g: InstanceClass.R6G,
    x1: InstanceClass.X1,
    x1e: InstanceClass.X1E,
    d2: InstanceClass.D2,
    d3: InstanceClass.D3,
    d3en: InstanceClass.D3EN,
    inf1: InstanceClass.INF1,
    inf2: InstanceClass.INF2,
    g4dn: InstanceClass.G4DN,
    p3: InstanceClass.P3,
    trn1: InstanceClass.TRN1,
    trn2: InstanceClass.TRN2,
    z1d: InstanceClass.Z1D,
    h1: InstanceClass.H1
  };

  const instance = instances[key];
  if (!instance) throw new Error(`Invalid ${r} instance class: ${value}`);

  return instance;
};

export const parseInstanceSize = (
  r: Resources,
  value?: string
): InstanceSize => {
  if (!value) throw new Error(`${r} instance size is required`);
  const key = value?.toLowerCase();

  const instances: Record<string, InstanceSize> = {
    nano: InstanceSize.NANO,
    micro: InstanceSize.MICRO,
    small: InstanceSize.SMALL,
    medium: InstanceSize.MEDIUM,
    large: InstanceSize.LARGE,
    xlarge: InstanceSize.XLARGE,
    xlarge2: InstanceSize.XLARGE2,
    xlarge3: InstanceSize.XLARGE3,
    metal: InstanceSize.METAL
  };

  const instance = instances[key];
  if (!instance) throw new Error(`Invalid ${r} instance size: ${value}`);

  return instance;
};

export const s3AccessPolicy = (bucketArn: string) =>
  new PolicyStatement({
    actions: [
      "s3:PutObject",
      "s3:GetObject",
      "s3:ListBucket",
      "s3:DeleteObject"
    ],
    resources: [
      bucketArn,
      `${bucketArn}/*`,
      "arn:aws:s3:::statics-xtrim-sitio-publico",
      "arn:aws:s3:::statics-xtrim-sitio-publico/*"
    ]
  });
