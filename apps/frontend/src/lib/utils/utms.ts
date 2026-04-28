import type {
  TGenerateLinksUtms,
  TGetQueryParams,
  TGetUtmSource
} from "@interfaces/lib/utils/utm";

export const generateLinkUtms: TGenerateLinksUtms = ({
  utmSource = "web",
  utmMedium = "web",
  preOrigin,
  origin,
  url,
  additionalParams,
  tsource,
  utmCampaign,
  utmContent
}) => {
  if (!url) return "";

  if (url?.startsWith("/")) {
    url = url;
  }

  origin = `${preOrigin}${origin || ""}`;

  const params = new URLSearchParams();

  if (tsource) {
    params.append("tsource", tsource);
  }

  params.append("utm_source", utmSource);
  params.append("utm_medium", utmMedium);

  if (origin && !utmCampaign && !utmContent) {
    params.append("origen", origin);
    params.append("utm_campaign", origin);
    params.append("utm_content", origin);
  } else {
    if (utmCampaign) {
      params.append("utm_campaign", utmCampaign);
    }

    if (utmContent) {
      params.append("utm_content", utmContent);
    }
    params.append("origen", origin);
  }

  if (additionalParams) {
    additionalParams.forEach((param) => {
      params.append(param.key, param.value);
    });
  }
  const separator = url.includes("?") ? "&" : "?";
  return `${url === "/" ? "" : url}${separator}${params.toString()}`;
};

export const extractQueryParams: TGetQueryParams = (url: string) => {
  const params = new URL(url).searchParams;
  const res: Record<string, string | string[]> = {};

  for (const [key, value] of params.entries()) {
    if (!res[key]) {
      res[key] = value;
      continue;
    }

    res[key] = Array.isArray(res[key])
      ? [...res[key], value]
      : [res[key], value];
  }

  return res;
};

export const getUtmSource: TGetUtmSource = () => {
  const params = new URLSearchParams(window.location.search);

  return {
    utm_source: params.get("utm_source") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    referrer: params.get("referrer") || window.location.href
  };
};
