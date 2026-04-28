import type { CustomMetadata } from "@interfaces/metadata";
import type { TMediaImage, TSEO } from "@interfaces/lib/strapi/modules";
import { mapOpenGraphType } from "./openGraph";
import { mapUrlMedia } from "@lib/helpers/mappers/utils";

const resolveStrapiImageUrl = (image?: TMediaImage) =>
  mapUrlMedia(image || null);

const parseRobots = (metaRobots?: string) => {
  const value = (metaRobots ?? "").toLowerCase();
  return {
    index: !value.includes("noindex"),
    follow: !value.includes("nofollow")
  };
};

export const mapStrapiSeoToMetadata = (
  seo?: Partial<TSEO> | null,
  pageUrl = "/"
) => {
  const canonical = seo?.canonicalURL ?? pageUrl;
  const { index, follow } = parseRobots(seo?.metaRobots);
  const openGraphImage = seo?.openGraph?.ogImage ?? seo?.metaImage ?? undefined;
  const imageUrl = resolveStrapiImageUrl(openGraphImage);
  const ogTitle = seo?.openGraph?.ogTitle ?? seo?.metaTitle;
  const ogDescription = seo?.openGraph?.ogDescription ?? seo?.metaDescription;
  const ogUrl = seo?.openGraph?.ogUrl ?? canonical;
  const ogType = mapOpenGraphType(seo?.openGraph?.ogType);

  const metadata: CustomMetadata = {
    title: seo?.metaTitle,
    description: seo?.metaDescription,
    keywords: seo?.keywords,
    url: ogUrl,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      ...(ogType ? { type: ogType } : null),
      url: ogUrl,
      images: imageUrl
    },
    twitter: {
      title: ogTitle,
      description: ogDescription,
      images: imageUrl
    }
  };

  return { metadata, index, follow };
};
