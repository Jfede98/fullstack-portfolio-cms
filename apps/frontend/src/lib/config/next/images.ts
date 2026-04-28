import type { NextConfig } from "next";
import {
  STRAPI_BASE_URL,
  URL_STATIC_RESOURCES
} from "../../constants/constants";
import { normalizeHostname } from "./utils";

type ImageConfig = Partial<Required<NextConfig>["images"]>;

const allowedHosts: string[] = [
  STRAPI_BASE_URL,
  URL_STATIC_RESOURCES,
  "statics.dathaplus.com",
  //TODO: HARCODE S3 STG AND PROD, REVIEW THIS LATER
  "d1zbh0zoyx3qgr.cloudfront.net",
  "d2v6nu3ery768q.cloudfront.net"
]
  .map((host) => normalizeHostname(host || "").trim())
  .filter((host): host is string => Boolean(host));

const remotePatterns: ImageConfig["remotePatterns"] = allowedHosts.map(
  (host) => ({
    protocol: "https",
    hostname: host
  })
);

export const images: ImageConfig = { remotePatterns };
