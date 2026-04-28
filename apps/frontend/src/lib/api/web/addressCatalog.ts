"use server";

import { REVALIDATE_API } from "@lib/constants/constants";
import { RevalidateTags } from "@lib/constants/state";
import { fetchAdminToken } from "@lib/fetch";
import { fetchingWrapperError } from "../utils";

export type CityApiResponse = {
  data?: string[];
};

export const getCities = async (): Promise<string[]> =>
  fetchingWrapperError({
    errorMessage: "getCities",
    isThrowError: true,
    callback: async () => {
      const response = await fetchAdminToken<CityApiResponse>(
        "api/address-catalog/cities",
        {
          next: {
            revalidate: REVALIDATE_API,
            tags: [RevalidateTags.GLOBAL]
          }
        }
      );

      return Array.isArray(response?.data) ? response.data : [];
    }
  });
