"use server";

import type { SitemapPage } from "@interfaces/lib/strapi/modules";
import {
  SITEMAP_REVALIDATE_API,
  SITEMAP_BASE_URL
} from "@lib/constants/constants";
import { CollectionType, RevalidateTags } from "@lib/constants/state";
import { fetchAdminToken } from "@lib/fetch";
import { fetchingWrapperError } from "../utils";

export const getSitemapPages = async <
  T extends SitemapPage[] = SitemapPage[]
>() =>
  fetchingWrapperError<T>({
    errorMessage: "getSitemapPages",
    callback: async () => {
      const baseUrl = SITEMAP_BASE_URL;

      if (!baseUrl)
        throw new Error(
          "Sitemap configuration error: Neither SST_DOMAIN nor SITE_ORIGIN environment variables are configured."
        );

      const response = await fetchAdminToken<T>(
        `api/${CollectionType.PAGE}/sitemap`,
        {
          next: {
            revalidate: SITEMAP_REVALIDATE_API,
            tags: [RevalidateTags.SITEMAP]
          }
        }
      );

      if (!response || !Array.isArray(response) || response.length === 0)
        throw new Error("No pages found in sitemap response");

      return response;
    }
  });
