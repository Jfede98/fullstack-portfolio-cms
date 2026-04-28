import { Construct } from "constructs";
import { SecurityGroup } from "aws-cdk-lib/aws-ec2";
import type { TConstruct } from "@aws/interfaces/construct";
import type { TSecurityGroup } from "@aws/interfaces/sg";
import { generateTags } from "@aws/helper/tag";
import { CfnOutput } from "aws-cdk-lib";
import { Resources } from "@aws/stack/constants/enums";

export class SecurityGroupConstruct extends Construct {
  private readonly name: string;
  private readonly sg: SecurityGroup;

  constructor(config: TConstruct<TSecurityGroup>) {
    super(config.scope, config.id);

    this.name = config.name;

    this.sg = new SecurityGroup(this, config.id, {
      vpc: config.vpc,
      allowAllOutbound: true,
      description: config.description,
      securityGroupName: this.name
    });

    this._generateOutputs(config.id);
    generateTags(this, config.name, config.tags);
  }

  private _generateOutputs(id: string) {
    const sgOutId = "SecurityGroupId";
    const rand = Math.random().toString(36).substring(2, 7);
    new CfnOutput(this, sgOutId, {
      value: this.sg.securityGroupId,
      exportName: Resources.SG + `${id}-${rand}`
    });
  }

  get Name() {
    return this.name;
  }

  get SecurityGroup() {
    return this.sg;
  }
}
