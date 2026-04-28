/// <reference path="./.sst/platform/config.d.ts" />

type TRegion = "us-east-1";

export default $config({
  app(input) {
    const stage = input?.stage ?? "dev";
    return {
      name: process.env.SST_APP_NAME!,
      removal: "remove",
      protect: ["production", "prod"].includes(stage),
      home: "aws",
      providers: {
        aws: {
          region: process.env.SST_REGION! as TRegion
        }
      }
    };
  },
  async run() {
    const aws = await import("@pulumi/aws");
    const vpcId = process.env.SST_VPC_ID!;
    const wafId = process.env.SST_ARN_WAF;

    const privateSubnets =
      process.env.SST_VPC_SUBNET_IDS?.split(",") ??
      (
        await aws.ec2.getSubnets({
          filters: [{ name: "vpc-id", values: [vpcId] }],
          region: process.env.SST_VPC_REGION! as TRegion
        })
      ).ids;

    const securityGroups = process.env.SST_VPC_SECURITY_GROUPS?.split(",") ?? [
      (
        await aws.ec2.getSecurityGroup({
          vpcId: vpcId,
          name: "default"
        })
      ).id
    ];

    const nextjsSite = new sst.aws.Nextjs(process.env.SST_APP_NAME!, {
      domain: !process.env.SST_DOMAIN
        ? undefined
        : {
            name: process.env.SST_DOMAIN,
            dns: false,
            cert: process.env.SST_DOMAIN_CERT!
          },
      imageOptimization: {
        memory: "512 MB"
      },
      vpc: {
        privateSubnets,
        securityGroups
      },
      edge: {
        viewerResponse: {
          injection: `
            delete event.response.headers["server"];
            delete event.response.headers["x-amz-server-side-encryption"];
          `
        }
      },
      server: {
        runtime: "nodejs22.x"
      },
      transform: {
        cdn: {
          transform: {
            distribution: {
              webAclId: !wafId ? undefined : wafId
            }
          }
        }
      }
    });

    return {
      url: nextjsSite.url
    };
  }
});
