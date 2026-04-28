import { App, Stack, type StackProps } from "aws-cdk-lib";
import {
  AWS_ACTIVE_WAF_RULES,
  AWS_WAF_DESCRIPTION,
  AWS_WAF_INSTANCE_NAME
} from "../constants/env";
import { WAFConstruct } from "@aws/cdk/waf";
import { DEFAULT_TAGS } from "../constants/tags";
import { Resources } from "../constants/enums";
import { aws_wafv2 as wafv2 } from "aws-cdk-lib";
import type { IWafIpSet, TWafRules } from "@aws/interfaces/waf";

export class WafStackConstruct extends Stack {
  private readonly _app: App;
  private readonly _stage: string;
  private _wafArn: string | null;

  constructor(scope: App, id: string, stage: string, props: StackProps) {
    super(scope, id + "-" + stage, { ...props, crossRegionReferences: true });
    this._app = scope;
    this._stage = stage;
    this._wafArn = null;

    this._buildWaf();
  }

  private _buildWaf() {
    if (!AWS_WAF_INSTANCE_NAME || !AWS_WAF_DESCRIPTION)
      throw new Error(
        "AWS_WAF_INSTANCE_NAME or AWS_WAF_DESCRIPTION are not defined"
      );

    const ipSetArns: Record<string, string> = {};
    const ipSetResources: wafv2.CfnIPSet[] = [];

    this._createIpSets().forEach((config) => {
      const ipsetResource = this._createNewIPSet(config);
      ipSetArns[config.description] = ipsetResource.attrArn;
      ipSetResources.push(ipsetResource);
    });
    const name = AWS_WAF_INSTANCE_NAME;
    const id = `${name}-${this._stage}`;

    const activeRules = Boolean(AWS_ACTIVE_WAF_RULES);

    const waf = new WAFConstruct({
      scope: this,
      id,
      name: id,
      description: AWS_WAF_DESCRIPTION,
      scopeACL: "CLOUDFRONT",
      metricName: `${name}-${this._stage}-metric`,
      tags: DEFAULT_TAGS(Resources.WAF, this._stage),
      rules: activeRules ? this._rules(ipSetArns) : []
    });

    ipSetResources.forEach((res) => waf.node.addDependency(res));
    this._wafArn = waf.Instance.attrArn;
  }

  private _createNewIPSet({
    name,
    scope,
    ip,
    addresses,
    description
  }: IWafIpSet): wafv2.CfnIPSet {
    return new wafv2.CfnIPSet(this, name, {
      name,
      scope,
      ipAddressVersion: ip,
      addresses,
      description
    });
  }

  private _createIpSets(): IWafIpSet[] {
    return [
      {
        name: `${this._stage}-sp-web-xtrim_IPV4_Allow`,
        scope: "CLOUDFRONT",
        ip: "IPV4",
        addresses: [],
        description: "IPV4_Allow"
      },
      {
        name: `${this._stage}-sp-web-xtrim_IPV6_Allow`,
        scope: "CLOUDFRONT",
        ip: "IPV6",
        addresses: [],
        description: "IPV6_Allow"
      },
      {
        name: `${this._stage}-sp-web-xtrim_IPV4_Block`,
        scope: "CLOUDFRONT",
        ip: "IPV4",
        addresses: [],
        description: "IPV4_Block"
      },
      {
        name: `${this._stage}-sp-web-xtrim_IPV6_Block`,
        scope: "CLOUDFRONT",
        ip: "IPV6",
        addresses: [],
        description: "IPV6_Block"
      }
    ];
  }

  private _rules(ipSetArns: Record<string, string>): TWafRules {
    const wafRules: TWafRules = [
      {
        name: "AWS-AWSManagedRulesAntiDDoSRuleSet",
        statement: {
          managedRuleGroupStatement: {
            vendorName: "AWS",
            name: "AWSManagedRulesAntiDDoSRuleSet",
            managedRuleGroupConfigs: [
              {
                awsManagedRulesAntiDDoSRuleSet: {
                  clientSideActionConfig: {
                    challenge: {
                      usageOfAction: "ENABLED",
                      sensitivity: "HIGH",
                      exemptUriRegularExpressions: [
                        {
                          regexString:
                            "\/api\/|\.(acc|avi|css|gif|ico|jpe?g|js|json|mp[34]|ogg|otf|pdf|png|tiff?|ttf|webm|webp|woff2?|xml)$"
                        }
                      ]
                    }
                  }
                }
              }
            ]
          }
        },
        overrideAction: { none: {} },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "AntiDDoSSet"
        }
      },
      {
        name: "sp-wp-xtrim_IPV4_Allow",
        action: { allow: {} },
        statement: {
          ipSetReferenceStatement: { arn: ipSetArns["IPV4_Allow"] }
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "IPV4_Allow"
        }
      },
      {
        name: "sp-wp-xtrim_IPV6_Allow",

        action: { allow: {} },
        statement: {
          ipSetReferenceStatement: { arn: ipSetArns["IPV6_Allow"] }
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "IPV6_Allow"
        }
      },
      {
        name: "sp-wp-xtrim_IPV4_Block",

        action: { block: {} },
        statement: {
          ipSetReferenceStatement: { arn: ipSetArns["IPV4_Block"] }
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "IPV4_Block"
        }
      },
      {
        name: "sp-wp-xtrim_IPV6_Block",

        action: { block: {} },
        statement: {
          ipSetReferenceStatement: { arn: ipSetArns["IPV6_Block"] }
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "IPV6_Block"
        }
      },
      {
        name: "GeoRule",
        action: { block: {} },
        statement: {
          geoMatchStatement: {
            countryCodes: ["CU", "RU", "IR", "KP", "SY", "VE"]
          }
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "GeoRule"
        }
      },
      {
        name: "GlobalRateBasedRule",
        action: { count: {} },
        statement: {
          rateBasedStatement: { limit: 1000, aggregateKeyType: "IP" }
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "GlobalRate"
        }
      },
      {
        name: "RateBasedRuleGet",
        action: { count: {} },
        statement: {
          rateBasedStatement: {
            limit: 500,
            aggregateKeyType: "IP",
            scopeDownStatement: {
              byteMatchStatement: {
                fieldToMatch: { method: {} },
                positionalConstraint: "EXACTLY",
                searchString: "GET",
                textTransformations: [{ priority: 0, type: "NONE" }]
              }
            }
          }
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "RateGet"
        }
      },
      {
        name: "RateBasedRulePOST",
        action: { count: {} },
        statement: {
          rateBasedStatement: {
            limit: 100,
            aggregateKeyType: "IP",
            scopeDownStatement: {
              orStatement: {
                statements: [
                  {
                    byteMatchStatement: {
                      fieldToMatch: { method: {} },
                      positionalConstraint: "EXACTLY",
                      searchString: "POST",
                      textTransformations: [{ priority: 0, type: "NONE" }]
                    }
                  },
                  {
                    byteMatchStatement: {
                      fieldToMatch: { method: {} },
                      positionalConstraint: "EXACTLY",
                      searchString: "PUT",
                      textTransformations: [{ priority: 0, type: "NONE" }]
                    }
                  },
                  {
                    byteMatchStatement: {
                      fieldToMatch: { method: {} },
                      positionalConstraint: "EXACTLY",
                      searchString: "DELETE",
                      textTransformations: [{ priority: 0, type: "NONE" }]
                    }
                  }
                ]
              }
            }
          }
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "RateWriteOpsCount"
        }
      },
      {
        name: "BodySizeRestrictionRule",
        action: { count: {} },
        statement: {
          sizeConstraintStatement: {
            fieldToMatch: {
              body: {
                oversizeHandling: "MATCH"
              }
            },
            comparisonOperator: "GT",
            size: 16384,
            textTransformations: [{ priority: 0, type: "NONE" }]
          }
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "BodySize"
        }
      },
      {
        name: "AWS-AWSManagedRulesAmazonIpReputationList",
        overrideAction: { none: {} },
        statement: {
          managedRuleGroupStatement: {
            vendorName: "AWS",
            name: "AWSManagedRulesAmazonIpReputationList",
            ruleActionOverrides: [
              {
                name: "AWSManagedIPReputationList",
                actionToUse: { block: {} }
              },
              {
                name: "AWSManagedReconnaissanceList",
                actionToUse: { count: {} }
              },
              {
                name: "AWSManagedIPDDoSList",
                actionToUse: { block: {} }
              }
            ]
          }
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "ReputationList"
        }
      },
      {
        name: "ManagedIPDDoSRateLimit",
        action: { count: {} },
        statement: {
          rateBasedStatement: {
            limit: 1000,
            aggregateKeyType: "IP",
            scopeDownStatement: {
              labelMatchStatement: {
                scope: "LABEL",
                key: "awswaf:managed:aws:amazon-ip-list:AWSManagedIPDDoSList"
              }
            }
          }
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "DdosRate"
        }
      },
      {
        name: "Aws-aws-managtedrulesanonymousIpList",
        overrideAction: { none: {} },
        statement: {
          managedRuleGroupStatement: {
            vendorName: "AWS",
            name: "AWSManagedRulesAnonymousIpList",
            ruleActionOverrides: [
              {
                name: "AnonymousIPList",
                actionToUse: { block: {} }
              },
              {
                name: "HostingProviderIPList",
                actionToUse: { block: {} }
              }
            ]
          }
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "AnonymousList"
        }
      },
      {
        name: "AWS-AWSManagedRulesCommonRuleSet",
        overrideAction: { none: {} },
        statement: {
          managedRuleGroupStatement: {
            vendorName: "AWS",
            name: "AWSManagedRulesCommonRuleSet",
            ruleActionOverrides: [
              {
                name: "NoUserAgent_HEADER",
                actionToUse: { block: {} }
              },
              { name: "UserAgent_BadBots_HEADER", actionToUse: { block: {} } },
              {
                name: "SizeRestrictions_QUERYSTRING",
                actionToUse: { block: {} }
              },
              {
                name: "SizeRestrictions_Cookie_HEADER",
                actionToUse: { block: {} }
              },
              { name: "SizeRestrictions_BODY", actionToUse: { block: {} } },
              { name: "SizeRestrictions_URIPATH", actionToUse: { block: {} } },
              { name: "EC2MetaDataSSRF_BODY", actionToUse: { block: {} } },
              { name: "EC2MetaDataSSRF_COOKIE", actionToUse: { block: {} } },
              { name: "EC2MetaDataSSRF_URIPATH", actionToUse: { block: {} } },
              {
                name: "EC2MetaDataSSRF_QUERYARGUMENTS",
                actionToUse: { block: {} }
              },
              { name: "GenericLFI_QUERYARGUMENTS", actionToUse: { block: {} } },
              { name: "GenericLFI_URIPATH", actionToUse: { block: {} } },
              { name: "GenericLFI_BODY", actionToUse: { block: {} } },
              {
                name: "RestrictedExtensions_URIPATH",
                actionToUse: { block: {} }
              },
              {
                name: "RestrictedExtensions_QUERYARGUMENTS",
                actionToUse: { block: {} }
              },
              { name: "GenericRFI_QUERYARGUMENTS", actionToUse: { block: {} } },
              { name: "GenericRFI_BODY", actionToUse: { block: {} } },
              { name: "GenericRFI_URIPATH", actionToUse: { block: {} } },
              { name: "CrossSiteScripting_COOKIE", actionToUse: { block: {} } },
              {
                name: "CrossSiteScripting_QUERYARGUMENTS",
                actionToUse: { block: {} }
              },
              { name: "CrossSiteScripting_BODY", actionToUse: { block: {} } },
              { name: "CrossSiteScripting_URIPATH", actionToUse: { block: {} } }
            ]
          }
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "CommonSet"
        }
      },
      {
        name: "AWS-AWSManagedRulesSQLiRuleSet",
        overrideAction: { none: {} },
        statement: {
          managedRuleGroupStatement: {
            vendorName: "AWS",
            name: "AWSManagedRulesSQLiRuleSet"
          }
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "SQLISet"
        }
      },
      {
        name: "AWS-AWSManagedRulesAdminProtectionRuleSet",
        overrideAction: { none: {} },
        statement: {
          managedRuleGroupStatement: {
            vendorName: "AWS",
            name: "AWSManagedRulesAdminProtectionRuleSet",
            ruleActionOverrides: [
              {
                name: "AdminProtection_URIPATH",
                actionToUse: { block: {} }
              }
            ]
          }
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "AdminSet"
        }
      },
      {
        name: "AWS-AWSManagedRulesBotControlRuleSet",
        overrideAction: { none: {} },
        statement: {
          managedRuleGroupStatement: {
            vendorName: "AWS",
            name: "AWSManagedRulesBotControlRuleSet",
            ruleActionOverrides: [
              { name: "CategoryAdvertising", actionToUse: { block: {} } },
              { name: "CategoryArchiver", actionToUse: { block: {} } },
              { name: "CategoryContentFetcher", actionToUse: { block: {} } },
              { name: "CategoryEmailClient", actionToUse: { block: {} } },
              { name: "CategoryHttpLibrary", actionToUse: { block: {} } },
              { name: "CategoryLinkChecker", actionToUse: { block: {} } },
              { name: "CategoryMiscellaneous", actionToUse: { block: {} } },
              { name: "CategoryMonitoring", actionToUse: { block: {} } },
              { name: "CategoryScrapingFramework", actionToUse: { block: {} } },
              { name: "CategorySearchEngine", actionToUse: { block: {} } },
              { name: "CategorySecurity", actionToUse: { block: {} } },
              { name: "CategorySeo", actionToUse: { block: {} } },
              { name: "CategorySocialMedia", actionToUse: { count: {} } },
              { name: "CategoryAI", actionToUse: { block: {} } },
              { name: "SignalAutomatedBrowser", actionToUse: { block: {} } },
              { name: "SignalKnownBotDataCenter", actionToUse: { block: {} } },
              { name: "SignalNonBrowserUserAgent", actionToUse: { count: {} } },
              {
                name: "TGT_VolumetricIpTokenAbsent",
                actionToUse: { challenge: {} }
              },
              { name: "TGT_VolumetricSession", actionToUse: { captcha: {} } },
              {
                name: "TGT_SignalAutomatedBrowser",
                actionToUse: { captcha: {} }
              },
              {
                name: "TGT_SignalBrowserInconsistency",
                actionToUse: { captcha: {} }
              },
              { name: "TGT_TokenReuseIp", actionToUse: { count: {} } },
              {
                name: "TGT_ML_CoordinatedActivityMedium",
                actionToUse: { count: {} }
              },
              {
                name: "TGT_ML_CoordinatedActivityHigh",
                actionToUse: { count: {} }
              }
            ]
          }
        },
        visibilityConfig: {
          sampledRequestsEnabled: true,
          cloudWatchMetricsEnabled: true,
          metricName: "BotSet"
        }
      }
    ];
    return wafRules;
  }

  get app() {
    return this._app;
  }

  get wafArn() {
    return this._wafArn;
  }
}
