import type { StackProps } from "aws-cdk-lib";
import type { Construct } from "constructs";
import type { TTags } from "@aws/interfaces/utils";

export type TConstruct<T> = T & {
  scope: Construct;
  id: string;
  props?: StackProps;
  tags?: TTags;
};
