import { App } from "aws-cdk-lib";
import { CDKStackConstruct } from "@aws/stack/resource/construct";
import { WafStackConstruct } from "@aws/stack/resource/waf";
import { AWS_STACK_NAME, REGION } from "@aws/stack/constants/env";
import { AssetsBucketsStack } from "@aws/stack/resource/assets";

(async () => {
  try {
    const app = new App();
    let envStage = app.node.tryGetContext("env") as string;
    if (!envStage)
      throw new Error("No environment specified. Use -c env=`environment`");
    if (envStage === "dev") envStage = "stg";

    const nameStacks = AWS_STACK_NAME;

    // const { wafArn } = new WafStackConstruct(
    //   app,
    //   `${nameStacks}-waf`,
    //   envStage,
    //   {
    //     env: {
    //       region: "us-east-1"
    //     }
    //   }
    // );

    // new CDKStackConstruct(app, nameStacks, envStage, wafArn, {
    //   env: {
    //     region: REGION
    //   }
    // });

    new AssetsBucketsStack(app, `S3AssetsWeb`, {
      env: {
        account: "277790937284",
        region: REGION
      }
    });
  } catch (error) {
    console.error("ERROR | ", error);
  }
})();
