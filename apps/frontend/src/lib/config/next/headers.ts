import type { NextConfig } from "next";
import type { Header } from "next/dist/lib/load-custom-routes";

type HeaderConfig = NextConfig["headers"];

const pageRoutes: Header = {
  source: "/:path*",
  headers: [
    {
      key: "X-DNS-Prefetch-Control",
      value: "on"
    },
    {
      key: "Cross-Origin-Opener-Policy",
      value: "same-origin"
    },
    {
      key: "Strict-Transport-Security",
      value: "max-age=31536000; includeSubDomains; preload"
    },
    {
      key: "X-Content-Type-Options",
      value: "nosniff"
    },
    {
      key: "X-Frame-Options",
      value: "SAMEORIGIN"
    },
    {
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin"
    },
    {
      key: "X-XSS-Protection",
      value: "1; mode=block"
    },
    {
      key: "Permissions-Policy",
      value: "geolocation=self"
    }
  ]
};

const apiRoutes: Header = {
  source: "/api/:path*",
  headers: [
    { key: "Access-Control-Allow-Credentials", value: "true" },
    { key: "Access-Control-Allow-Origin", value: "*" },
    {
      key: "Access-Control-Allow-Methods",
      value: "GET,DELETE,PATCH,POST,PUT"
    },
    {
      key: "Access-Control-Allow-Headers",
      value:
        "Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    }
  ]
};

export const headers: HeaderConfig = async () => [pageRoutes, apiRoutes];
