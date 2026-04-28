import type { PutObjectCommandInput } from "@aws-sdk/client-s3";
import type { BucketProps, IBucket } from "aws-cdk-lib/aws-s3";
import type { Dirent } from "fs";

export type TPutObject = Pick<PutObjectCommandInput, "Key" | "ContentType"> & {
  fullPath: string;
  entry: Dirent;
};

export type TEntryFn = {
  dir: string;
  prefix: string;
  entry: Dirent<string>;
};

export interface TS3Construct extends Partial<IBucket>, BucketProps {
  id: string;
}
