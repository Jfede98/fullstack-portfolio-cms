import {
  CfnPrefixList,
  Peer,
  Port,
  type SecurityGroup
} from "aws-cdk-lib/aws-ec2";
import type { Construct } from "constructs";

export const applyCategorizedAccess = (
  scope: Construct,
  ec2SG: SecurityGroup,
  stage: string,
  ipList: any
) => {
  Object.entries(ipList).forEach(([groupName, configs]: [string, any]) => {
    const map = new Map<string, string>();
    configs.forEach((config: any) => {
      config.ips.forEach((item: { cidr: string; label: string }) => {
        if (map.has(item.cidr)) {
          if (!map.get(item.cidr)?.includes(item.label)) {
            map.set(item.cidr, `${map.get(item.cidr)}, ${item.label}`);
          }
        } else {
          map.set(item.cidr, item.label);
        }
      });
    });

    if (map.size === 0) return;

    const prefixList = new CfnPrefixList(scope, `${groupName}PL-${stage}`, {
      addressFamily: "IPv4",
      maxEntries: Math.max(map.size, 3),
      prefixListName: `pl-xtrim-${groupName.toLowerCase()}-${stage}`,
      entries: Array.from(map.entries()).map(([cidr, label]) => ({
        cidr,
        description: `${label} (${groupName})`
      }))
    });

    configs.forEach((config: any) => {
      ec2SG.addIngressRule(
        Peer.prefixList(prefixList.attrPrefixListId),
        Port.tcp(config.port),
        `Allow ${groupName} on port ${config.port}`
      );
    });
  });
};
