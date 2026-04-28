import { images, headers, redirects, experimental, compiler } from "@next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@sitio-publico/shared-ui"],
  trailingSlash: false,
  poweredByHeader: false,
  reactStrictMode: false,
  images,
  headers,
  redirects,
  experimental,
  compiler
};

export default nextConfig;
