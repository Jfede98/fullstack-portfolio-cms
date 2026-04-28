import type { NextConfig } from "next";

type TCompilerApp = NextConfig["compiler"];

export const compiler: TCompilerApp = {
  // removeConsole: process.env.NODE_ENV === "production"
};
