import type { SecurityGroup, Vpc } from "aws-cdk-lib/aws-ec2";

export type TSecurityGroup = Partial<SecurityGroup> & {
  vpc: Vpc;
  name: string;
  description: string;
};
