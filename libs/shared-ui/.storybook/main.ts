import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { mergeConfig } from "vite";
import type { StorybookConfig } from "@storybook/react-vite";
import tsconfigPaths from "vite-tsconfig-paths";

function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
  stories: ["../src/stories/**/*.@(mdx|stories.@(js|jsx|ts|tsx))"],
  addons: [
    getAbsolutePath("@storybook/addon-vitest"),
    getAbsolutePath("@storybook/addon-docs")
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {}
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      savePropValueAsString: true
    }
  },
  viteFinal: async (config) => {
    const isVitest = process.env.VITEST === "true";

    return mergeConfig(config, {
      base: isVitest ? "/" : process.env.AWS_BUCKET_PREFIX ?? "./",
      plugins: [tsconfigPaths({ ignoreConfigErrors: true })]
    });
  }
};

export default config;
