import { type SubnetType } from "aws-cdk-lib/aws-ec2";

export class Subnet {
  private readonly _name: string;
  private readonly _type: SubnetType;
  private readonly _cidrMask?: number;

  constructor(name: string, type: SubnetType, cidrMask?: number) {
    this._name = name;
    this._type = type;
    this._cidrMask = cidrMask;
  }

  get Name() {
    return this._name;
  }

  get Type() {
    return this._type;
  }

  get CidrMask() {
    return this._cidrMask;
  }
}
