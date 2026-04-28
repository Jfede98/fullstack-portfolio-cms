import { CloudfrontGateway, S3Gateway } from "../aws/src/lib/main";
import path from "path";

const PREFIX = process.env.AWS_BUCKET_PREFIX;
const BUCKET = process.env.AWS_BUCKET_NAME;
const DISTRIBUTION_CF_ID = process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID;
const STORYBOOK_PATH = "web-statics";
const DOMAIN = process.env.DOMAIN_URL;
const STAGE = process.env.STAGE ?? "dev";
const AWS_BUCKET_REGION =
  process.env.AWS_BUCKET_REGION || process.env.AWS_REGION || "us-east-1";

const main = async () => {
  try {

    if (!STORYBOOK_PATH || !BUCKET || !DISTRIBUTION_CF_ID || !PREFIX)
      throw new Error("environments are not defined");

    const directory = path.resolve(process.cwd(), STORYBOOK_PATH!);

    const s3 = new S3Gateway(AWS_BUCKET_REGION, BUCKET);
    const cf = new CloudfrontGateway(DISTRIBUTION_CF_ID);

    await s3.clearPrefix(`${PREFIX}/`);
    await s3.uploadDir(directory, `${PREFIX}/`);

    const hashAssignedRewrite = await cf.hasFunctionAssigned(`${PREFIX}/*`);

    if (!hashAssignedRewrite)
      await cf.setupStorybookFunction("storybook-url-rewrite", PREFIX, STAGE);

    await cf.invalidate([`/${PREFIX}`]);

    if (!DOMAIN) return;
    const url = DOMAIN.startsWith("http") ? DOMAIN : `https://${DOMAIN}`;
    console.log(`url: ${url}/${PREFIX}`);
  } catch (error) {
    console.error("Error | Deployment", error);
  }
};

(async () => await main())();
