import type { TConstruct } from "@aws/interfaces/construct";
import type { TWafConfig, TWafRules } from "@aws/interfaces/waf";
import { Construct } from "constructs";
import { CfnOutput, aws_wafv2 as wafv2 } from "aws-cdk-lib";
import { generateTags } from "@aws/helper/tag";

export class WAFConstruct extends Construct {
  private readonly _name: string;
  private readonly _instance: wafv2.CfnWebACL;

  constructor({
    scope,
    id,
    name,
    tags,
    description,
    rules,
    scopeACL,
    metricName,
    props,
    ...config
  }: TConstruct<TWafConfig>) {
    super(scope, id);

    this._name = name;

    const finalRules = rules && rules.length > 0 ? rules : this._defaultRules();

    this._instance = new wafv2.CfnWebACL(this, name, {
      name,
      description,
      scope: scopeACL ?? "CLOUDFRONT",
      defaultAction: { allow: {} },
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: metricName
      },
      rules: finalRules.map((r, idx) => ({
        ...r,
        priority: idx
      })),
      ...config
    });

    this._generateOutputs(id);
    generateTags(this, id, tags);
  }

  private _generateOutputs(id: string): void {
    const rand = Math.random().toString(36).substring(2, 7);
    const outArn = new CfnOutput(this, "Arn", {
      value: this._instance.attrArn,
      exportName: `${id}-Arn-${rand}`
    });
    outArn.overrideLogicalId("Arn");
  }

  private _defaultRules(): TWafRules {
    const rules: TWafRules = [
      {
        name: "AWS-AWSManagedRulesCommonRuleSet",
        statement: {
          managedRuleGroupStatement: {
            vendorName: "AWS",
            name: "AWSManagedRulesCommonRuleSet",
            excludedRules: []
          }
        },
        overrideAction: { none: {} },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "CommonRules"
        }
      },
      {
        name: "AWS-AWSManagedRulesAmazonIpReputationList",
        statement: {
          managedRuleGroupStatement: {
            vendorName: "AWS",
            name: "AWSManagedRulesAmazonIpReputationList"
          }
        },
        overrideAction: { none: {} },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "IPReputation"
        }
      },
      {
        name: "AWS-AWSManagedRulesKnownBadInputsRuleSet",
        statement: {
          managedRuleGroupStatement: {
            vendorName: "AWS",
            name: "AWSManagedRulesKnownBadInputsRuleSet"
          }
        },
        overrideAction: { none: {} },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "BadInputs"
        }
      }
    ];

    return rules;
  }

  get Name() {
    return this._name;
  }

  get Instance() {
    return this._instance;
  }
}
