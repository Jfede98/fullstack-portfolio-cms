"use server";

import { REVALIDATE_API } from "@lib/constants/constants";
import { RevalidateTags } from "@lib/constants/state";
import { fetchAdminToken } from "@lib/fetch";
import type { Response } from "@interfaces/lib/strapi/modules";
import type { TStrapiSemiautomaticFlow } from "@interfaces/lib/semiautomaticFlow";
import type { TStrapiAutomaticFlow } from "@interfaces/lib/automaticFlow";
import { fetchingWrapperError } from "../utils";

export const getSemiautomaticFlow = async (): Promise<TStrapiSemiautomaticFlow | null> =>
  fetchingWrapperError({
    errorMessage: "getSemiautomaticFlow",
    callback: async () => {
      const response = await fetchAdminToken<Response<TStrapiSemiautomaticFlow>>(
        "api/semiautomatic-flow",
        {
          next: {
            revalidate: REVALIDATE_API,
            tags: [RevalidateTags.PAGES]
          }
        }
      );

      if (!response?.data) throw new Error("SemiautomaticFlow not found");

      return response.data;
    }
  });

export const getAutomaticFlow = async (): Promise<TStrapiAutomaticFlow | null> =>
  fetchingWrapperError({
    errorMessage: "getAutomaticFlow",
    callback: async () => {
      const response = await fetchAdminToken<Response<TStrapiAutomaticFlow>>(
        "api/automatic-flow",
        {
          next: {
            revalidate: REVALIDATE_API,
            tags: [RevalidateTags.PAGES]
          }
        }
      );

      if (!response?.data) throw new Error("AutomaticFlow not found");

      return response.data;
    }
  });