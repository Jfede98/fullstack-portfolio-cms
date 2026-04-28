"use server";

import type {
  TCustomFetch,
  TFetchAdminToken,
  TFetchTomLeadsResponse,
  TFetchTomLeadsToken
} from "@interfaces/lib/fetch/fetching";
import { FetchingResponseType, RevalidateTags } from "@lib/constants/state";
import {
  TOM_GESTOR_LEADS_OAUTH_URL,
  STRAPI_ADMIN_TOKEN,
  STRAPI_BASE_URL,
  STRAPI_ORIGIN_HEADER
} from "@lib/constants/constants";

export const fetchAdminToken: TFetchAdminToken = async (input, config) => {
  const url = `${STRAPI_BASE_URL}/${input}`;

  const customHeaders = {
    Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}`,
    Origin: STRAPI_ORIGIN_HEADER ?? "localhost"
  };

  return customFetch(url, {
    ...config,
    headers: {
      ...config?.headers,
      ...customHeaders
    }
  });
};

export const fetchLeadsTom: TFetchTomLeadsToken = async (
  config
): Promise<TFetchTomLeadsResponse> => {
  if (!TOM_GESTOR_LEADS_OAUTH_URL || !config?.token)
    throw new Error("TOM_GESTOR_LEADS_OAUTH_URL not found");

  const { leadId, ...restConfig } = config;
  const baseUrl =
    TOM_GESTOR_LEADS_OAUTH_URL + "/lead/lead" + (leadId ? `/${leadId}` : "");
  const customHeaders: Record<string, string> = {
    Authorization: config.token,
    "Content-Type": "application/json"
  };

  const response = await fetch(baseUrl, {
    ...restConfig,
    headers: {
      ...restConfig?.headers,
      ...customHeaders
    },
    next: {
      ...restConfig?.next,
      tags: [...(restConfig?.next?.tags ?? []), RevalidateTags.ALL]
    }
  });

  const body = await response.text();
  return { status: response.status, body };
};

export const customFetch: TCustomFetch = async (
  url,
  { typeResponse = FetchingResponseType.JSON, ...config }
) => {
  
  const data = fetch(url, {
    ...config,
    next: {
      ...config?.next,
      tags: [...(config?.next?.tags ?? []), RevalidateTags.ALL]
    }
  })
    .then((res) =>
      typeResponse === FetchingResponseType.JSON ? res.json() : res.text()
    )
    .catch((e) => {
      throw e;
    });

  return data;
};
