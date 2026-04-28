import type {
  FetchingTokenRequest,
  TomGestorLeadGetToken,
  TomGestorLeadsTokenResponse
} from "@interfaces/lib/fetch/tom";
import {
  SST_STAGE,
  TOM_GESTOR_LEADS_CLIENT_GRANT_TYPE,
  TOM_GESTOR_LEADS_CLIENT_ID,
  TOM_GESTOR_LEADS_CLIENT_SECRET,
  TOM_GESTOR_LEADS_OAUTH_URL
} from "@lib/constants/constants";
import { customFetch } from "@lib/fetch";
import { isValidString } from "@lib/utils/global";

export const getTokenTomGestorLead: TomGestorLeadGetToken = async () => {
  const requiredConstants = [
    TOM_GESTOR_LEADS_OAUTH_URL,
    TOM_GESTOR_LEADS_CLIENT_ID,
    TOM_GESTOR_LEADS_CLIENT_SECRET
  ];

  if (!requiredConstants.every(isValidString))
    throw new Error(
      "'TOM_GESTOR_OAUTH_ENVIRONMENTS' not founds to get token | assistedLeadCallback"
    );

  const baseUrl = TOM_GESTOR_LEADS_OAUTH_URL + "/oauth/token";
  const request: FetchingTokenRequest = {
    grant_type: TOM_GESTOR_LEADS_CLIENT_GRANT_TYPE,
    client_id: TOM_GESTOR_LEADS_CLIENT_ID!,
    client_secret: TOM_GESTOR_LEADS_CLIENT_SECRET!
  };

  const res = await customFetch<TomGestorLeadsTokenResponse>(baseUrl, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request)
  });

  if (!res) throw new Error("No response to get Token from service TOM");
  return SST_STAGE === "prod" ? res.access_token : res.data!.access_token;
};
