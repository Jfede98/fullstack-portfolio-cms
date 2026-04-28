/// <reference types="vitest/config" />
// @ts-nocheck
import { dirname as dirnameFn, resolve, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { glob } from "glob";
import tsConfigPaths from "vite-tsconfig-paths";
import path from "node:path";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import cleanPlugin from "vite-plugin-clean";
import { configDefaults } from "vitest/config";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : dirnameFn(fileURLToPath(import.meta.url));
const repoRoot = path.join(dirname, "..", "..");

const enableStorybookTests = process.env.VITEST_STORYBOOK === "true";

export default defineConfig({
  plugins: [
    react(),
    tsConfigPaths({ ignoreConfigErrors: true }),
    dts(),
    tailwindcss(),
    cleanPlugin()
  ],
  build: {
    emptyOutDir: true,
    cssCodeSplit: true,
    assetsInlineLimit: 0,
    lib: {
      entry: resolve(__dirname, "src", "lib", "main.ts"),
      name: "shared-ui",
      fileName: (format) => (format === "es" ? "bundle.js" : "bundle.cjs"),
      formats: ["es"]
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      input: Object.fromEntries(
        glob
          .sync(`src/lib/**/!(*.d).{ts,tsx}`)
          .map((file) => [
            relative("src/lib", file.slice(0, -extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url))
          ])
      ),
      output: {
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name].js",
        manualChunks: undefined
      }
    }
  },
  test: {
    workers: 1,
    exclude: [...configDefaults.exclude, "**/node_modules/**", "**/.git/**"],
    server: {
      deps: {
        inline: [/lru-cache/],
        external: ["react"]
      }
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "../../coverage/libs/shared-ui",
      include: ["./src/lib/**/*.{ts,tsx}"],
      exclude: [
        "**/node_modules/**",
        "**/interfaces/**",
        "**/main.ts",
        "**/*.d.ts",
        "**/style.ts",
        "**/components/index.ts",
        "**/constants/index.ts",
        "**/hooks/index.ts",
        "./src/test/vitest.setup.ts",
        "./src/stories/**/*.{ts,tsx}"
      ]
    },
    projects: [
      {
        extends: true,
        name: "storybook",
        plugins: [
          storybookTest({
            configDir: path.join(dirname, ".storybook")
          })
        ],
        test: {
          name: "storybook",
          setupFiles: [".storybook/vitest.setup.ts"],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }]
          }
        }
      },
      {
        name: "unit",
        resolve: {
          alias: {
            "@sitio-publico/shared-ui": resolve(
              __dirname,
              "src",
              "lib",
              "main.ts"
            ),
            "@shared-ui/components": resolve(
              __dirname,
              "src",
              "lib",
              "components"
            ),
            "@shared-ui/interfaces": resolve(
              __dirname,
              "src",
              "lib",
              "interfaces"
            ),
            "@shared-ui/config": resolve(__dirname, "src", "lib", "config"),
            "@shared-ui/constants": resolve(
              __dirname,
              "src",
              "lib",
              "constants"
            ),
            "@shared-ui/hooks": resolve(__dirname, "src", "lib", "hooks"),
            "@shared-ui/helpers": resolve(__dirname, "src", "lib", "helpers")
          }
        },
        test: {
          environment: "jsdom",
          include: ["src/**/*.test.{ts,tsx}"],
          setupFiles: ["src/test/vitest.setup.ts"]
        }
      }
    ]
  }
});
