import type {
  TFetchingWrapperError,
  FetchingWrapperRequest
} from "@interfaces/lib/fetch/utils";
import { STAGE } from "@lib/constants/constants";
import { notFound } from "next/navigation";

export const fetchingWrapperError: TFetchingWrapperError = async <T>({
  callback,
  errorMessage,
  isThrowError = false,
  isNotFound = false
}: FetchingWrapperRequest) => {
  try {
    return (await callback?.()) as T;
  } catch (error) {
    if (STAGE !== "production") console.error(`error | ${errorMessage}`, error);
    if (isThrowError) throw error;
    if (isNotFound) return notFound();
    return undefined as T;
  }
};
