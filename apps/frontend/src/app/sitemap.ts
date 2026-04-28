import type { MetadataRoute } from "next";
import { buildSiteMap } from "@lib/helpers/sitemap";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  return await buildSiteMap();
};

export default sitemap;
