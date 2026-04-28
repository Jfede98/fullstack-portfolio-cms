import type {
  InstanceClass,
  InstanceProps,
  InstanceSize,
  SecurityGroup,
  Vpc
} from "aws-cdk-lib/aws-ec2";

export type TInstanceUsers = "ec2-user" | "ubuntu" | "admin";

export interface TEC2Config extends Partial<InstanceProps> {
  vpc: Vpc;
  securityGroup?: SecurityGroup;
  instanceName: string;
  instanceClass?: InstanceClass;
  instanceSize?: InstanceSize;
  generateKeyPair?: boolean;
  instanceUser?: TInstanceUsers;
  generageNewEip?: boolean;
  eip?: string;
}
