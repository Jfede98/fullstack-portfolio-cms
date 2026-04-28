import { SITEMAP_BASE_URL } from "@lib/constants/constants";
import { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => {
  const baseUrl = SITEMAP_BASE_URL;

  if (!baseUrl)
    throw new Error(
      "Robots configuration error: Neither SST_DOMAIN nor SITE_ORIGIN environment variables are configured."
    );

  const siteMap = `${baseUrl}/sitemap.xml`;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"]
    },
    sitemap: siteMap.startsWith("http") ? siteMap : `https://${siteMap}`
  };
};

export default robots;
