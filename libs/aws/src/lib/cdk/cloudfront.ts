import { Construct } from "constructs";
import { CfnOutput } from "aws-cdk-lib";
import {
  Distribution,
  ViewerProtocolPolicy,
  SecurityPolicyProtocol
} from "aws-cdk-lib/aws-cloudfront";
import type { TCfConstruct, TCfDns } from "../main";
import type { TConstruct } from "@aws/interfaces/construct";
import { generateTags } from "@aws/helper/tag";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";
import { Resources } from "@aws/stack/constants/enums";

export class CloudFrontConstruct extends Construct {
  public readonly instance: Distribution;

  constructor({
    scope,
    id,
    origin,
    tags,
    certificateArn,
    ...config
  }: TConstruct<TCfConstruct>) {
    super(scope, id);

    const dns = this._setDnsConfig(certificateArn, config.domainNames);
    this.instance = new Distribution(this, "Dist", {
      defaultBehavior: {
        ...config.behaviorOptions,
        origin,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      },
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      comment: config.comment ?? id,
      ...config,
      ...dns
    });

    const rand = Math.random().toString(36).substring(2, 7);

    ["DistributionId", "DomainName"].forEach((output) => {
      const out = new CfnOutput(this, output, {
        exportName: id + Resources.CLOUDFRONT + "-" + output + "-" + rand,
        value: (this.instance as any)[
          output.charAt(0).toLowerCase() + output.slice(1)
        ]
      });
      out.overrideLogicalId(output);
    });

    generateTags(this, id, tags);
  }

  private _getCertificateByArn(arn: string) {
    return Certificate.fromCertificateArn(this, "ExistingSiteCert", arn);
  }

  private _setDnsConfig(
    certificateArn?: string,
    domainNames?: string[]
  ): TCfDns {
    if (!certificateArn && !domainNames?.length) return undefined;

    if (!domainNames || domainNames.length === 0)
      throw new Error(
        "Domain names must be provided when a certificate ARN is specified."
      );

    if (!certificateArn) throw new Error("Certificate ARN must be provided.");

    return {
      domainNames: domainNames,
      certificate: this._getCertificateByArn(certificateArn)
    };
  }

  get Instance() {
    return this.instance;
  }
}
