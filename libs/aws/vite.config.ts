//@ts-nocheck

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsConfigPaths from "vite-tsconfig-paths";
import cleanPlugin from "vite-plugin-clean";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [tsConfigPaths(), dts(), cleanPlugin()],
  build: {
    lib: {
      entry: resolve(__dirname, "src", "lib", "main.ts"),
      name: "@sitio-publico/aws",
      fileName: "bundle"
    },
    rollupOptions: {
      external: [""],
      output: {
        globals: {}
      }
    }
  }
});
