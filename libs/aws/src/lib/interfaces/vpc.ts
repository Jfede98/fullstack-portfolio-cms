import type { Subnet } from "@aws/cdk/subnet";

export type VPCConstructProps = {
  name: string;
  cidr: string;
  maxAzs?: number;
  subnets?: Subnet[];
  natGateways?: number;
};