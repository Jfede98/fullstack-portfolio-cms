"use server";

import { getTokenTomGestorLead } from "./tom";
import { fetchingWrapperError } from "../utils";
import { TOM_GESTOR_LEADS_OAUTH_URL } from "@lib/constants/constants";
import { isValidString } from "@lib/utils/global";
import type {
  CoverageApiResponse,
  CoverageCheckResult,
  CoverageDataFound
} from "@interfaces/lib/fetch/coverage";

export type { CoverageCheckResult };

export const checkCoverageByCoords = async (
  latitude: number,
  longitude: number,
  address?: string
): Promise<CoverageCheckResult> =>
  fetchingWrapperError<CoverageCheckResult>({
    isThrowError: true,
    errorMessage: "checkCoverageByCoords",
    callback: async () => {
      if (!isValidString(TOM_GESTOR_LEADS_OAUTH_URL)) {
        throw new Error("TOM_GESTOR_LEADS_OAUTH_URL is not configured");
      }

      const accessToken = await getTokenTomGestorLead();
      const coverageUrl = `${TOM_GESTOR_LEADS_OAUTH_URL}/lead/integration/node-coverage`;

      const response = await fetch(coverageUrl, {
        method: "POST",
        cache: "no-cache",
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ lat: latitude, lng: longitude })
      });

      const rawBody = await response.text();

      let parsed: CoverageApiResponse;
      try {
        parsed = JSON.parse(rawBody) as CoverageApiResponse;
      } catch {
        throw new Error(`Error al parsear respuesta de cobertura: ${rawBody}`);
      }

      const hasCoverage = parsed.data.code === 0;

      return {
        hasCoverage,
        message: parsed.message ?? "",
        latitude,
        longitude,
        address,
        coverageData: hasCoverage
          ? (parsed.data as { code: 0; data: CoverageDataFound }).data
          : undefined,
        noCoverageReason: !hasCoverage
          ? (parsed.data as { code: -1; message: string }).message
          : undefined,
        rawResponse: parsed
      };
    }
  });
