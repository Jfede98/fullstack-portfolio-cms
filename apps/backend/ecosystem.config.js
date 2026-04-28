const path = require("path");
const dotenv = require("dotenv");
const os = require("os");

const envFile = path.resolve(__dirname, ".env");
const result = dotenv.config({ path: envFile });

if (result.error) {
  throw result.error;
}

const defaultProps = (stage) => ({
  name: `strapi_${stage}`,
  script: "bunx",
  args: "strapi start",
  cwd: path.join(os.homedir(), "app", stage),
  env: {
    ...result.parsed,
    NODE_ENV: "production"
  }
});

module.exports = {
  apps: ["stg", "dev", "prod", "qa"].map(defaultProps)
};
