import type { NextConfig } from "next";

type TExperimentalApp = NextConfig["experimental"];

export const experimental: TExperimentalApp = {
  serverActions: {
    allowedOrigins: ["*.xtrim.com.ec", "xtrim.com.ec"]
  }
};