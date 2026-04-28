"use server";

import { REVALIDATE_MENU_API } from "@lib/constants/constants";
import { RevalidateTags } from "@lib/constants/state";
import { fetchAdminToken } from "@lib/fetch";
import {
  GetMenuRequest,
  TGetMenu,
  TStrapiFooter,
  TStrapiNavbar
} from "@interfaces/lib/menu";
import { DataResponse } from "@interfaces/lib/strapi/modules";
import { fetchingWrapperError } from "../utils";

export const getMenu: TGetMenu = async <
  T extends TStrapiNavbar | TStrapiFooter
>({
  collection
}: GetMenuRequest) =>
  fetchingWrapperError({
    isNotFound: true,
    errorMessage: `getMenu [${collection}]`,
    callback: async () => {
      const response = await fetchAdminToken<DataResponse<T>>(
        `api/${collection}?pLevel`,
        {
          next: {
            revalidate: REVALIDATE_MENU_API,
            tags: [RevalidateTags.MENUS]
          }
        }
      );
      
      if (!response?.data)
        throw new Error(`not found data for [Menu ${collection}]`);
      return response.data;
    }
  });
