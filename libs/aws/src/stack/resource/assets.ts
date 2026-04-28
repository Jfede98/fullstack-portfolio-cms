import { Stack, type StackProps } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class AssetsBucketsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this._bukketAssetsPermissions(id);
  }

  private _bukketAssetsPermissions(id: string) {
    const roleStgName =
      "xtrim-web-stg-xtrimec2instancev2stgInstanceRole25E3-ywk63j5UG4Bw";
    const roleProdName =
      "xtrim-web-prod-xtrimec2instancev2prodInstanceRole2E-ZTbt2NZN5S6v";

    const s3StgBucketName = "xtrim-assets-stg";
    const s3ProdBucketName = "xtrim-assets-prod";

    new iam.CfnManagedPolicy(this, "TempSyncPolicy", {
      managedPolicyName: `TempSyncPolicy-${id}`,
      roles: [roleStgName, roleProdName],
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: [
              "s3:ListBucket",
              "s3:GetBucketLocation",
              "s3:ListBucketVersions"
            ],
            Resource: [
              `arn:aws:s3:::${s3ProdBucketName}`,
              `arn:aws:s3:::${s3StgBucketName}`
            ]
          },
          {
            Effect: "Allow",
            Action: [
              "s3:PutObject",
              "s3:PutObjectAcl",
              "s3:GetObject",
              "s3:DeleteObjectVersion"
            ],
            Resource: [
              `arn:aws:s3:::${s3ProdBucketName}/*`,
              `arn:aws:s3:::${s3StgBucketName}/*`
            ]
          }
        ]
      }
    });

    const prodBucket = s3.Bucket.fromBucketName(
      this,
      "ProdBucket",
      s3ProdBucketName
    );

    prodBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [
          new iam.ArnPrincipal(
            `arn:aws:iam::${this.account}:role/${roleStgName}`
          ),
          new iam.ArnPrincipal(
            `arn:aws:iam::${this.account}:role/${roleProdName}`
          )
        ],
        actions: [
          "s3:ListBucket",
          "s3:PutObject",
          "s3:PutObjectAcl",
          "s3:GetBucketLocation",
          "s3:GetObject",
          "s3:ListBucketVersions",
          "s3:DeleteObjectVersion"
        ],
        resources: [prodBucket.bucketArn, `${prodBucket.bucketArn}/*`]
      })
    );
  }
}
