import type { CfnWebACLProps } from "aws-cdk-lib/aws-waf";
import { aws_wafv2 as wafv2 } from "aws-cdk-lib";

export type TWafRules = Omit<wafv2.CfnWebACL.RuleProperty, "priority">[];

export interface TWafConfig extends Omit<
  CfnWebACLProps,
  "rules" | "defaultAction"
> {
  description: string;
  scopeACL: "CLOUDFRONT" | "REGIONAL";
  rules?: TWafRules;
}

export type TIPVersion = "IPV4" | "IPV6";

export interface IWafIpSet {
  name: string;
  scope: TWafConfig["scopeACL"];
  ip: TIPVersion;
  addresses: string[];
  description: string;
}
