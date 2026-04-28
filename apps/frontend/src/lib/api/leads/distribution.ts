"use server";

import { fetchAdminToken } from "@lib/fetch";
import { fetchingWrapperError } from "../utils";

type TDispatchLeadEmailRequest = {
  routingConfigDocumentId?: string;
  leadFormDocumentId?: string;
  pageSlug?: string;
  leadData: Record<string, unknown>;
};

type TDispatchLeadEmailResponse = {
  success: boolean;
  sentCount: number;
  totalRecipients: number;
  distributionMode: "email" | "tom" | "both";
};

const dispatchLeadEmailCallback = async (
  payload: TDispatchLeadEmailRequest
): Promise<TDispatchLeadEmailResponse> =>
  fetchAdminToken<TDispatchLeadEmailResponse>(
    "api/lead-routing-configs/dispatch-email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

export const dispatchLeadEmail = async (
  payload: TDispatchLeadEmailRequest
): Promise<TDispatchLeadEmailResponse | null> => {
  try {
    return await fetchingWrapperError<TDispatchLeadEmailResponse>({
      isThrowError: true,
      errorMessage: "dispatchLeadEmail",
      callback: () => dispatchLeadEmailCallback(payload)
    });
  } catch (error) {
    return null;
  }
};
