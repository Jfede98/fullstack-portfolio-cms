"use server";

import type { IGetPageBySlug } from "@interfaces/lib/pages";
import type { Data, Response } from "@interfaces/lib/strapi/modules";
import { REVALIDATE_API } from "@lib/constants/constants";
import { CollectionType, RevalidateTags } from "@lib/constants/state";
import { fetchAdminToken } from "@lib/fetch";
import { fetchingWrapperError } from "../utils";

export const getPageBySlug: IGetPageBySlug = async ({
  pageUID,
  revalidate = REVALIDATE_API,
  collection = CollectionType.PAGE,
  isMetadata = false
}) =>
  fetchingWrapperError({
    isNotFound: isMetadata,
    errorMessage: `getPageBySlug [${pageUID}]`,
    callback: async () => {
      if (!pageUID) throw new Error("PageUID is required to build the url");
      if (pageUID.includes(".") || pageUID.includes("_next")) return null;
      if (collection !== CollectionType.PAGE)
        throw new Error("Collection type is not supported for getPageBySlug");

      const response = await fetchAdminToken<Response<Data>>(
        `api/${collection}/by-slug?slug=${encodeURIComponent(pageUID)}`,
        {
          next: {
            revalidate,
            tags: [RevalidateTags.PAGES]
          }
        }
      );

      if (!response?.data) throw new Error("Page not found");

      return response.data;
    }
  });
