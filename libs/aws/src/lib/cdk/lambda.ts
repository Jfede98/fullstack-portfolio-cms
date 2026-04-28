import { generateTags } from "@aws/helper/tag";
import type { TConstruct } from "@aws/interfaces/construct";
import type { TLambdaConfig } from "@aws/interfaces/lambda";
import { CfnOutput, Duration } from "aws-cdk-lib";
import type { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class NodeLambdaConstruct extends Construct {
  private readonly _name: string;
  private readonly _instance: NodejsFunction;

  constructor({
    scope,
    id,
    name,
    vpc,
    timeout,
    tags,
    ...config
  }: TConstruct<TLambdaConfig>) {
    super(scope, id);

    this._name = name;

    this._instance = new NodejsFunction(this, name, {
      bundling: {
        externalModules: ["@aws-sdk/*"],
        minify: true,
        sourceMap: true
      },
      runtime: config.runtime ?? Runtime.NODEJS_24_X,
      vpc: vpc,
      timeout: timeout ?? Duration.seconds(30),
      ...config
    });

    this._generateOutputs(id);
    generateTags(this, id, tags);
  }

  private _generateOutputs(id: string): void {
    const cleanId = id
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");

    const hostOutId = `${cleanId}FunctionArn`;
    const rand = Math.random().toString(36).substring(2, 7);

    const hostOut = new CfnOutput(this, hostOutId, {
      value: this._instance.functionArn,
      exportName: id + hostOutId + rand
    });
    hostOut.overrideLogicalId(hostOutId);
  }

  public addRolePolicy(policy: PolicyStatement) {
    this._instance.addToRolePolicy(policy);
  }

  get Instance() {
    return this._instance;
  }

  get Name() {
    return this._name;
  }
}
