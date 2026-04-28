"use server";

import { REVALIDATE_API } from "@lib/constants/constants";
import { RevalidateTags } from "@lib/constants/state";
import { fetchAdminToken } from "@lib/fetch";
import type { StrapiGlobal } from "@interfaces/components/whatsapp";
import type { Response } from "@interfaces/lib/strapi/modules";
import { fetchingWrapperError } from "../utils";

export const getGlobal = async (pLevel = 2): Promise<StrapiGlobal | null> =>
  fetchingWrapperError({
    errorMessage: "getGlobal",
    callback: async () => {
      const response = await fetchAdminToken<Response<StrapiGlobal>>(
        `api/global?pLevel=${pLevel}`,
        {
          next: {
            revalidate: REVALIDATE_API,
            tags: [RevalidateTags.GLOBAL, RevalidateTags.PAGES]
          }
        }
      );

      if (!response?.data) throw new Error("Global not found");

      return response.data;
    }
  });
