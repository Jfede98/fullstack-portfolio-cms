import type {
  InstanceClass,
  InstanceSize,
  SecurityGroup,
  Vpc
} from "aws-cdk-lib/aws-ec2";
import type { DatabaseInstanceSourceProps } from "aws-cdk-lib/aws-rds";

export interface TRDSConfig extends Partial<
  Omit<DatabaseInstanceSourceProps, "dbName" | "instanceType">
> {
  vpc: Vpc;
  name: string;
  appSecurityGroup: SecurityGroup;
  dbName: string;
  instanceClass: InstanceClass;
  instanceSize: InstanceSize;
  dbUsername: string;
  secretName: string;
}
