"use server";

import type { TSEO, TStructuredData } from "@interfaces/lib/strapi/modules";
import { getPageBySlug } from "@lib/api/web/page";

type TSeo = Partial<TSEO> | undefined;

export const fetchStructuredData = async (
  pageUID: string
): Promise<TStructuredData | undefined> => {
  const data = await getPageBySlug({
    pageUID,
    isMetadata: true
  });

  const seo =
    (data as { seo?: TSeo })?.seo ??
    (data as { attributes?: { seo?: TSeo } })?.attributes?.seo;

  return seo?.structuredData;
};
