import { Construct } from "constructs";
import { RemovalPolicy, CfnOutput } from "aws-cdk-lib";
import {
  Bucket,
  BlockPublicAccess,
  BucketEncryption,
  type IBucket
} from "aws-cdk-lib/aws-s3";
import type { TS3Construct } from "../main";
import type { TConstruct } from "@aws/interfaces/construct";
import { generateTags } from "@aws/helper/tag";
import { Resources } from "@aws/stack/constants/enums";
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId
} from "aws-cdk-lib/custom-resources";

export class S3BucketConstruct extends Construct {
  public readonly bucket: IBucket;

  constructor({ scope, id, tags, ...props }: TConstruct<TS3Construct>) {
    super(scope, id);

    this.bucket = new Bucket(this, "Bucket", {
      bucketName: props.bucketName,
      blockPublicAccess: props.blockPublicAccess ?? BlockPublicAccess.BLOCK_ALL,
      encryption: props.encryption ?? BucketEncryption.S3_MANAGED,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });
    this._generateOutputs(id);
    generateTags(this, id, tags);
  }

  private _generateOutputs(id: string) {
    const rand = Math.random().toString(36).substring(2, 7);
    const bucketOutId = "BucketArn";
    const out = new CfnOutput(this, bucketOutId, {
      value: this.bucket.bucketArn,
      exportName: id + Resources.S3 + `-${bucketOutId}-${rand}`
    });

    out.overrideLogicalId(bucketOutId);
  }

  public createEmptyDirectory(bucket: IBucket, directoryName: string) {
    const key = directoryName.endsWith("/")
      ? directoryName
      : `${directoryName}/`;

    new AwsCustomResource(this, directoryName, {
      onCreate: {
        service: "S3",
        action: "putObject",
        parameters: {
          Bucket: bucket.bucketName,
          Key: key,
          Body: ""
        },
        physicalResourceId: PhysicalResourceId.of(`${bucket.bucketName}-${key}`)
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: [bucket.arnForObjects(key)]
      })
    });
  }

  get Instance() {
    return this.bucket;
  }
}
