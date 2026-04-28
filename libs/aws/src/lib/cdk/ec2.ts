import { Construct } from "constructs";
import {
  Instance,
  InstanceType,
  InstanceClass,
  InstanceSize,
  MachineImage,
  CfnEIP,
  KeyPairType,
  CfnEIPAssociation
} from "aws-cdk-lib/aws-ec2";
import type { TConstruct } from "@aws/interfaces/construct";
import type { TEC2Config } from "@aws/interfaces/ec2";
import { generateTags } from "@aws/helper/tag";
import { CfnOutput, Stack } from "aws-cdk-lib";
import { KeyPair } from "aws-cdk-lib/aws-ec2";
import { Resources } from "@aws/stack/constants/enums";
import { AWS_EC2_KEYPAIR_INSTANCE_NAME } from "@aws/stack/constants/env";

export class EC2Construct extends Construct {
  public readonly _instance: Instance;
  private readonly _name: string;
  private readonly _keyPair?: KeyPair;

  constructor({
    scope,
    id,
    vpc,
    instanceName,
    instanceSize,
    securityGroup,
    tags,
    generateKeyPair = false,
    instanceUser,
    generageNewEip,
    eip,
    ...config
  }: TConstruct<TEC2Config>) {
    super(scope, id);

    this._name = instanceName;

    this._keyPair = generateKeyPair ? this._generateKeyPair() : undefined;

    this._instance = new Instance(this, id, {
      vpc: vpc,
      instanceName: instanceName,
      instanceType: InstanceType.of(
        config.instanceClass ?? InstanceClass.T3,
        instanceSize ?? InstanceSize.MICRO
      ),
      securityGroup,
      keyPair: this._keyPair,
      machineImage: config.machineImage ?? MachineImage.latestAmazonLinux2(),
      ...config
    });

    this._generateOutputs(id, instanceUser);
    this._generateEIP(generageNewEip);
    this._assignEIP(eip);
    generateTags(this, id, tags);
  }

  private _generateOutputs(id: string, instanceUser?: string): void {

    const rand = Math.random().toString(36).substring(2, 7);

    [
      "InstanceId",
      "InstancePublicDnsName",
      "InstancePublicIp",
      "InstancePrivateIp"
    ].forEach((output) => {
      const out = new CfnOutput(this, output, {
        exportName: id + Resources.EC2 + "-" + output + "-" + rand,
        value: (this._instance as any)[
          output.charAt(0).toLowerCase() + output.slice(1)
        ]
      });
      out.overrideLogicalId(output);
    });

    if (!this._keyPair) return;

    const extraInfo = {
      KeySsmPath: `/ec2/keypair/${this._keyPair.keyPairId}`,
      KeyName: this._keyPair.keyPairName,
      InstanceUser: instanceUser ?? "ec2-user",
      SsmRegion: Stack.of(this).region
    };

    

    Object.entries(extraInfo).forEach(([label, val]) => {
      const out = new CfnOutput(this, label, {
        value: val,
        exportName: id + label + rand
      });
      out.overrideLogicalId(label);
    });
  }

  private _generateEIP(generageNewEip?: boolean) {
    if (!generageNewEip) return;
    const eip = new CfnEIP(this, "Ec2EIP", {
      instanceId: this._instance.instanceId
    });

    new CfnOutput(this, "InstancePublicIP", {
      value: eip.ref
    });
  }

  private _assignEIP(allocationId?: string) {
    if (!allocationId || !this._instance) {
      console.log("allocationId o instancia are not defined.");
      return;
    }

    const cleanId = allocationId.trim();

    if (!cleanId.startsWith("eipalloc-"))
      throw new Error(`ID de EIP Inválido detectado en síntesis: ${cleanId}`);

    new CfnEIPAssociation(this, "EIPAssoc", {
      allocationId: cleanId,
      instanceId: this._instance.instanceId
    });
  }

  private _generateKeyPair() {
    return new KeyPair(this, AWS_EC2_KEYPAIR_INSTANCE_NAME, {
      type: KeyPairType.RSA
    });
  }

  get Instance() {
    return this._instance;
  }

  get Name() {
    return this._name;
  }

  get KeyPair() {
    return this._keyPair;
  }
}
