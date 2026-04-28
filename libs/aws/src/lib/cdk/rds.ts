import { Construct } from "constructs";
import { InstanceType, Instance } from "aws-cdk-lib/aws-ec2";
import {
  DatabaseInstance,
  PostgresEngineVersion,
  Credentials,
  DatabaseInstanceEngine
} from "aws-cdk-lib/aws-rds";
import { CfnOutput, Duration } from "aws-cdk-lib";
import type { TConstruct } from "@aws/interfaces/construct";
import type { TRDSConfig } from "@aws/interfaces/rds";
import { generateTags } from "@aws/helper/tag";

export class RDSConstruct extends Construct {
  public readonly instance: DatabaseInstance;
  private readonly _name: string;
  private readonly _dbName: string;

  constructor({
    scope,
    id,
    tags,
    instanceClass,
    instanceSize,
    dbUsername,
    secretName,
    name,
    dbName,
    ...config
  }: TConstruct<TRDSConfig>) {
    super(scope, id);

    this._name = name;
    this._dbName = dbName;
    this.instance = new DatabaseInstance(this, name, {
      engine:
        config.engine ??
        DatabaseInstanceEngine.postgres({
          version: PostgresEngineVersion.VER_17_7
        }),
      instanceType: InstanceType.of(instanceClass, instanceSize),
      databaseName: dbName,
      credentials: Credentials.fromGeneratedSecret(dbUsername, {
        secretName
      }),
      allocatedStorage: config.allocatedStorage ?? 20,
      backupRetention: config.backupRetention ?? Duration.days(7),
      ...config
    });

    this._generateOutputs(id);
    generateTags(this, id, tags);
  }

  private _generateOutputs(id: string): void {
    const hostOutId = "DbHost";
    const rand = Math.random().toString(36).substring(2, 7);

    const hostOut = new CfnOutput(this, hostOutId, {
      value: this.instance.dbInstanceEndpointAddress,
      exportName: `${id}-DbHost-${rand}`
    });
    hostOut.overrideLogicalId(hostOutId);

    if (!this.instance.secret) return;
    const secretIdOutId = "DbSecretId";
    const secretOut = new CfnOutput(this, secretIdOutId, {
      value: this.instance.secret.secretName,
      exportName: `${id}-DbSecretPath-${rand}`
    });
    secretOut.overrideLogicalId(secretIdOutId);

    const secretArnOutId = "DbSecretArn";
    const secretArnOut = new CfnOutput(this, secretArnOutId, {
      value: this.instance.secret.secretArn,
      exportName: `${id}-${secretArnOutId}-${rand}`
    });
    secretArnOut.overrideLogicalId(secretArnOutId);
  }

  addGrantRead(ec2Instance: Instance) {
    this.instance.secret?.grantRead(ec2Instance.role);
  }

  get DbName() {
    return this._dbName;
  }

  get Name() {
    return this._name;
  }

  get Instance() {
    return this.instance;
  }
}
