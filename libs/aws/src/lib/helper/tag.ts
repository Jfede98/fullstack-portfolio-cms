import type { TTags } from "@aws/interfaces/utils";
import { Tags } from "aws-cdk-lib";
import type { IConstruct } from "constructs";

export const generateTags = (scope: IConstruct, name: string, tags?: TTags) => {
  Tags.of(scope).add("Name", name);
  if (tags) tags.forEach(({ key, value }) => Tags.of(scope).add(key, value));
};
