"use server";

import type {
  TAssistedLeadJsonResponse,
  TAssistedLeadRequestPartial,
  TUpdateAssistedLeadRequest
} from "@interfaces/lib/fetch/assistedLead";
import { fetchingWrapperError } from "../utils";
import { getTokenTomGestorLead } from "./tom";
import { fetchLeadsTom } from "@lib/fetch";
import { AssistedLeadErrorCode } from "@lib/constants/state";

type AssistedLeadCallbackResponse = {
  success: boolean;
  isDuplicate: boolean;
  errorCode?: AssistedLeadErrorCode;
  id?: string;
  phone?: string;
};

const DUPLICATE_MESSAGE_FRAGMENTS = [
  "no se puede crear otro lead",
  "24 horas",
  "duplicado"
];

const isDuplicateLeadMessage = (message: string) => {
  const normalized = message.toLowerCase();
  return DUPLICATE_MESSAGE_FRAGMENTS.some((fragment) =>
    normalized?.includes(fragment)
  );
};

const assistedLeadCallback = async (
  lead: TAssistedLeadRequestPartial
): Promise<AssistedLeadCallbackResponse> => {
  const token = await getTokenTomGestorLead();

  const response = await fetchLeadsTom({
    token,
    method: "POST",
    body: JSON.stringify(lead)
  });

  if (!response?.body)
    throw new Error(
      "error on Fetching service TomGestorSendLead | assistedLeadCallback"
    );

  if (response.body.includes("error"))
    throw new Error(
      `error on Fetching service TomGestorSendLead | status ${response.status} | assistedLeadCallback`
    );

  let resMapper: TAssistedLeadJsonResponse;
  try {
    resMapper = JSON.parse(response.body) as TAssistedLeadJsonResponse;
  } catch {
    throw new Error(
      `error on Fetching service TomGestorSendLead | status ${response.status} | assistedLeadCallback`
    );
  }

  const message = `${resMapper.message ?? ""} ${resMapper.serverMessage ?? ""}`;
  const isDuplicate =
    message?.includes(AssistedLeadErrorCode.DUPLICATE) ||
    isDuplicateLeadMessage(message);

  if (response.status >= 500 && !isDuplicate)
    throw new Error(
      `error on Fetching service TomGestorSendLead | status ${response.status} | assistedLeadCallback`
    );

  const isSuccess = response.status === 201 && resMapper.response === true;
  const errorCode = isDuplicate
    ? AssistedLeadErrorCode.DUPLICATE
    : isSuccess
      ? undefined
      : AssistedLeadErrorCode.ERROR;

  return {
    success: isSuccess,
    isDuplicate,
    errorCode,
    id: resMapper.data?.lead._id,
    phone: lead.customer?.phone
  };
};

export const sendAssistedLead = async (
  req: TAssistedLeadRequestPartial
): Promise<AssistedLeadCallbackResponse | null> => {
  try {
    return fetchingWrapperError<AssistedLeadCallbackResponse>({
      isThrowError: true,
      errorMessage: "sendAssistedLead",
      callback: () => assistedLeadCallback(req)
    });
  } catch (error) {
    return null;
  }
};

const updateAssistedLeadCallback = async (
  req: TUpdateAssistedLeadRequest
): Promise<AssistedLeadCallbackResponse> => {
  const { id, ...lead } = req;
  const token = await getTokenTomGestorLead();
  const response = await fetchLeadsTom({
    token,
    method: "PUT",
    leadId: id,
    body: JSON.stringify(lead)
  });
  if (!response?.body)
    throw new Error(
      "error on Fetching service TomGestorUpdateLead | updateAssistedLeadCallback"
    );

  let resMapper: TAssistedLeadJsonResponse;
  try {
    resMapper = JSON.parse(response.body) as TAssistedLeadJsonResponse;
  } catch {
    throw new Error(
      `error on Fetching service TomGestorUpdateLead | status ${response.status} | body no JSON | updateAssistedLeadCallback`
    );
  }

  const message = `${resMapper.message ?? ""} ${resMapper.serverMessage ?? ""}`;
  const isDuplicate =
    message.includes(AssistedLeadErrorCode.DUPLICATE) ||
    isDuplicateLeadMessage(message);

  if (response.status >= 500 && !isDuplicate)
    throw new Error(
      `error on Fetching service TomGestorUpdateLead | status ${response.status} | updateAssistedLeadCallback`
    );

  const isSuccess = response.status === 200 && resMapper.response === true;
  const errorCode = isDuplicate
    ? AssistedLeadErrorCode.DUPLICATE
    : isSuccess
      ? undefined
      : AssistedLeadErrorCode.ERROR;

  const result = {
    success: isSuccess,
    isDuplicate,
    errorCode,
    id: resMapper.data?.lead?._id ?? id,
    phone: lead.customer?.phone
  };
  return result;
};

export const updateAssistedLead = async (
  req: TUpdateAssistedLeadRequest
): Promise<AssistedLeadCallbackResponse | null> => {
  try {
    return fetchingWrapperError<AssistedLeadCallbackResponse>({
      isThrowError: true,
      errorMessage: "updateAssistedLead",
      callback: () => updateAssistedLeadCallback(req)
    });
  } catch {
    return null;
  }
};

