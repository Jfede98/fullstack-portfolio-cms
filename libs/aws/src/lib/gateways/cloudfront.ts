/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CloudFrontClient,
  CreateInvalidationCommand,
  CreateFunctionCommand,
  PublishFunctionCommand,
  DescribeFunctionCommand,
  UpdateDistributionCommand,
  GetDistributionConfigCommand,
  UpdateFunctionCommand,
  FunctionStage
} from "@aws-sdk/client-cloudfront";
import { cloudfrontFunctionRewrite } from "../helper/cf-function";
import type { TCreate, TFunction, TPublish } from "@aws/interfaces/cloudfront";

export class CloudfrontGateway {
  private readonly _cf: CloudFrontClient;
  private readonly _distId: string;

  constructor(distId: string) {
    this._cf = new CloudFrontClient({ region: "us-east-1" });
    this._distId = distId;
  }

  async setupStorybookFunction(
    functionName: string,
    pathPrefix: string,
    stage: string
  ) {
    const code = cloudfrontFunctionRewrite(pathPrefix, stage).trim();

    const functionARN = await this._upsertFunction(functionName, code);
    await this._attachToBehavior(functionARN);

    return functionARN;
  }

  async hasFunctionAssigned(pathPattern: string): Promise<boolean> {
    const { config } = await this._getDistributionConfig();
    const behavior =
      config.CacheBehaviors?.Items?.find(
        (b) => b.PathPattern === pathPattern
      ) || config.DefaultCacheBehavior;

    return (
      behavior?.FunctionAssociations?.Items?.some(
        (assoc) => assoc.EventType === "viewer-request"
      ) ?? false
    );
  }

  async invalidate(paths: string[]) {
    console.log("Cloudfront | Creating Invalidation");

    const command = new CreateInvalidationCommand({
      DistributionId: this._distId,
      InvalidationBatch: {
        CallerReference: Date.now().toString(),
        Paths: { Quantity: paths.length, Items: paths }
      }
    });

    return this._cf.send(command);
  }

  private async _createNewFunction({ code, name, etag }: TFunction) {
    console.log("Cloudfront | Creating new function...");
    const createRes = await this._create({ name, code });
    if (!etag) return;
    etag = createRes.ETag;
  }

  private async _updateFunction({ code, name, etag }: TFunction) {
    console.log("Cloudfront | Updating existing function...");
    const updateRes = await this._update({ name, code, etag });
    return updateRes.ETag;
  }

  private async _upsertFunction(name: string, code: string): Promise<string> {
    const existing = await this._getExistingFunction(name);
    let etag: string | undefined;

    if (existing) {
      etag = existing.ETag;
      if (!etag) {
        throw new Error(
          `Function '${name}' exists but does not have a valid ETag.`
        );
      }
      etag = await this._updateFunction({ name, code, etag });
    } else {
      await this._createNewFunction({ name, code, etag });
    }

    const published = await this._publish({ name, etag });
    return published.FunctionSummary!.FunctionMetadata!.FunctionARN!;
  }

  private async _attachToBehavior(functionARN: string) {
    console.log("Cloudfront | Checking distribution association...");

    const { config, etag } = await this._getDistributionConfig();

    const behavior = config.DefaultCacheBehavior!;
    const associations = behavior.FunctionAssociations?.Items || [];

    const alreadyAttached = associations.some(
      (a) => a.FunctionARN === functionARN
    );

    if (alreadyAttached) {
      console.log("Cloudfront | Function already attached.");
      return;
    }

    behavior.FunctionAssociations = {
      Quantity: associations.length + 1,
      Items: [
        ...associations,
        { FunctionARN: functionARN, EventType: "viewer-request" }
      ]
    };

    await this._cf.send(
      new UpdateDistributionCommand({
        Id: this._distId,
        DistributionConfig: config,
        IfMatch: etag
      })
    );

    console.log("Cloudfront | Function attached successfully.");
  }

  private async _getExistingFunction(name: string) {
    try {
      return await this._cf.send(
        new DescribeFunctionCommand({
          Name: name,
          Stage: FunctionStage.DEVELOPMENT
        })
      );
    } catch (e: any) {
      if (e.name === "NoSuchFunctionExists") return null;
      throw e;
    }
  }

  private _create({ code, name }: TCreate) {
    return this._cf.send(
      new CreateFunctionCommand({
        Name: name,
        FunctionCode: Buffer.from(code),
        FunctionConfig: {
          Comment: "Storybook Rewrite",
          Runtime: "cloudfront-js-2.0"
        }
      })
    );
  }

  private _update({ code, name, etag }: TFunction) {
    return this._cf.send(
      new UpdateFunctionCommand({
        Name: name,
        FunctionCode: Buffer.from(code),
        FunctionConfig: {
          Comment: "Storybook Rewrite",
          Runtime: "cloudfront-js-2.0"
        },
        IfMatch: etag
      })
    );
  }

  private _publish({ etag, name }: TPublish) {
    return this._cf.send(
      new PublishFunctionCommand({ Name: name, IfMatch: etag })
    );
  }

  private async _getDistributionConfig() {
    const res = await this._cf.send(
      new GetDistributionConfigCommand({ Id: this._distId })
    );
    if (!res.DistributionConfig) throw new Error("Config not found");
    return { config: res.DistributionConfig, etag: res.ETag };
  }
}
