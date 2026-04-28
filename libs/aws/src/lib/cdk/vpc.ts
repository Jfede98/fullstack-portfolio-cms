import { CfnOutput } from "aws-cdk-lib";
import {
  Vpc,
  IpAddresses,
  type SubnetConfiguration
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import type { VPCConstructProps } from "@aws/interfaces/vpc";
import type { Subnet } from "@aws/cdk/subnet";
import type { TConstruct } from "@aws/interfaces/construct";
import { generateTags } from "@aws/helper/tag";
import { Resources } from "@aws/stack/constants/enums";

export class VPCConstruct extends Construct {
  private readonly _name: string;
  private readonly _cidr: string;
  private readonly _maxAzs: number;
  private readonly _subnets: Subnet[];
  public readonly vpc: Vpc;

  constructor(config: TConstruct<VPCConstructProps>) {
    super(config.scope, config.id);

    this._name = config.name;
    this._cidr = config.cidr;
    this._maxAzs = config.maxAzs ?? 2;
    this._subnets = config.subnets ?? [];

    const subnetConfiguration: SubnetConfiguration[] = (
      config.subnets ?? []
    ).map((s) => ({
      name: s.Name,
      subnetType: s.Type,
      cidrMask: s.CidrMask
    }));

    this.vpc = new Vpc(this, config.name, {
      ipAddresses: IpAddresses.cidr(config.cidr),
      natGateways: config.natGateways ?? 1,
      maxAzs: config.maxAzs ?? 2,
      subnetConfiguration:
        subnetConfiguration.length > 0 ? subnetConfiguration : undefined
    });

    this._generateOutputs(config.id);
    generateTags(this, config.name, config.tags);
  }

  private _generateOutputs(id: string) {
    const outId = "VpcId";
    const vpcOutput = new CfnOutput(this, outId, {
      value: this.vpc.vpcId,
      exportName: id + Resources.VPC + `-${outId}`
    });

    vpcOutput.overrideLogicalId(outId);
  }

  get name() {
    return this._name;
  }

  get cidr() {
    return this._cidr;
  }

  get maxAzs() {
    return this._maxAzs;
  }

  get subnets() {
    return this._subnets;
  }
}
