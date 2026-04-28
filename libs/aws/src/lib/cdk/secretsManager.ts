import { generateTags } from "@aws/helper/tag";
import type { TConstruct } from "@aws/interfaces/construct";
import type {
  TConstructSecrect,
  TSecretConfig
} from "@aws/interfaces/secretsManager";
import {
  CfnOutput,
  SecretValue,
  aws_secretsmanager as secretsmanager
} from "aws-cdk-lib";
import type { Instance } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export class SecretsMangerConstruct extends Construct {
  private readonly _name: string;
  private readonly _instance: secretsmanager.Secret;

  constructor({
    scope,
    id,
    name,
    description,
    secrets,
    tags
  }: TConstruct<TSecretConfig>) {
    super(scope, id);

    this._name = name;

    const secretObjectValue = this._generateSecretObjectValue(secrets);

    this._instance = new secretsmanager.Secret(this, name, {
      secretName: name,
      description,
      secretObjectValue
    });

    this._generateOutputs(id);
    generateTags(this, id, tags);
  }

  private _createNewSecret(name: string) {
    return SecretValue.unsafePlainText(name);
  }

  private _generateOutputs(id: string): void {
    const rand = Math.random().toString(36).substring(2, 7);
    const outArn = new CfnOutput(this, "SecretArn", {
      value: this._instance.secretArn,
      exportName: `${id}-SecretArn-${rand}`
    });
    outArn.overrideLogicalId("SecretArn");
  }

  private _generateSecretObjectValue(secrets: TConstructSecrect[]) {
    return secrets.reduce(
      (acc, { label, value }) => ({
        ...acc,
        [label.toUpperCase()]: this._createNewSecret(value)
      }),
      {}
    );
  }

  public addGrantRead(instance: Instance, secret: secretsmanager.Secret) {
    return secret.grantRead(instance);
  }

  public getSecret(name: string, secretName: string) {
    return secretsmanager.Secret.fromSecretNameV2(this, name, secretName);
  }

  get Instance() {
    return this._instance;
  }

  get Name() {
    return this._name;
  }
}
