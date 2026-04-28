import type { Vpc } from "aws-cdk-lib/aws-ec2";
import type { FunctionOptions } from "aws-cdk-lib/aws-lambda";
import type { NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";

export interface TLambdaConfig
  extends Partial<FunctionOptions>, NodejsFunctionProps {
  name: string;
  vpc?: Vpc;
}
