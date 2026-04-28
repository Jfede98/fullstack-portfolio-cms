"use server";

import { getSitemapPages } from "@lib/api/web/sitemap";
import { SITEMAP_BASE_URL } from "@lib/constants/constants";
import { MetadataRoute } from "next";

export const buildSiteMap = async (): Promise<MetadataRoute.Sitemap> => {
  const baseUrl = SITEMAP_BASE_URL;
  try {
    const pages = await getSitemapPages();

    const metadata = pages.map((page) => {
      const url =
        page.slug === "home" || page.slug === "inicio"
          ? baseUrl
          : `${baseUrl}/${page.slug}`;

      const lastModified = page.updatedAt
        ? new Date(page.updatedAt)
        : new Date();
      const priority =
        page.slug === "home" || page.slug === "inicio" ? 1.0 : 0.8;

      return {
        url,
        lastModified,
        priority,
        changeFrequency:
          page.slug === "home" || page.slug === "inicio"
            ? ("daily" as const)
            : ("weekly" as const)
      };
    }) as MetadataRoute.Sitemap;

    return metadata;
  } catch (error) {
    return [
      {
        url: baseUrl ?? "",
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0
      }
    ];
  }
};
