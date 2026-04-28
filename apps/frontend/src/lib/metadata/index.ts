import type { Metadata } from "next";
import { PageType } from "@lib/constants/state";
import { SITE_ORIGIN } from "@lib/constants/constants";
import { buildMetadata, mapStrapiSeoToMetadata } from "@lib/metadata";
import { getPageBySlug } from "@lib/api/web/page";
import { PageResponse, TPageArgs } from "@interfaces/lib/pages";

export const processHomeMetadata = async (): Promise<Metadata> => {
  const data = await getPageBySlug({
    pageUID: PageType.HOME,
    isMetadata: true
  });

  return process(data, "/");
};

export const processDynamicMetadata = async ({
  params
}: TPageArgs): Promise<Metadata> => {
  const { slug } = await params;
  const path = `/${slug.join("/")}`;
  const data = await getPageBySlug({
    pageUID: slug.join("/"),
    isMetadata: true
  });

  return process(data, path);
};

export const processRootMetadata = async (): Promise<Metadata> => {
  const data = {
    title: "Xtrim template",
    description: "..."
  };

  return buildMetadata(data, true, undefined, SITE_ORIGIN);
};

const process = async (data: PageResponse, path: string) => {
  type TSeo = Parameters<typeof mapStrapiSeoToMetadata>[0];

  const seo =
    (data as { seo?: TSeo })?.seo ??
    (data as { attributes?: { seo?: TSeo } })?.attributes?.seo;

  const { metadata, index, follow } = mapStrapiSeoToMetadata(seo, path);
  return buildMetadata(metadata, index, follow, SITE_ORIGIN);
};
