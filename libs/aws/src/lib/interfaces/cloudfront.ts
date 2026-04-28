import type {
  BehaviorOptions,
  DistributionProps,
  IOrigin
} from "aws-cdk-lib/aws-cloudfront";

export type TCreate = {
  name: string;
  code: string;
};

export type TFunction = TCreate & {
  etag?: string;
};

export type TPublish = Pick<TFunction, "etag"> & Pick<TCreate, "name">;

export type TCfDns =
  | Pick<DistributionProps, "domainNames" | "certificate">
  | undefined;

export interface TCfConstruct extends Partial<
  Omit<DistributionProps, "certificate">
> {
  id: string;
  origin: IOrigin;
  certificateArn?: string;
  behaviorOptions?: Omit<BehaviorOptions, "origin">;
}
