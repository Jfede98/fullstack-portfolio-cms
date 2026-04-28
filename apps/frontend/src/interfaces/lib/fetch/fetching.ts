import type { FetchingResponseType } from "@lib/constants/state";
import type { RequestInit } from "next/dist/server/web/spec-extension/request";

type TCustomFetchRequest = RequestInit & {
  typeResponse?: FetchingResponseType;
};

export type TFetchTomLeadsResponse = {
  status: number;
  body: string;
};

export type TCustomFetch = <T>(
  url: string,
  req: TCustomFetchRequest
) => Promise<T>;

export type TFetchAdminToken = <T = unknown>(
  input: string | URL,
  config?: RequestInit | undefined
) => Promise<T>;

export type TFetchTomLeadsToken = (
  config?: ({ token: string; leadId?: string } & RequestInit) | undefined
) => Promise<TFetchTomLeadsResponse>;
