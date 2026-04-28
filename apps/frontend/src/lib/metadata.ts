import type { Metadata } from "next";
import { STAGE, URL_STATIC_RESOURCES } from "./constants/constants";
import type { CustomMetadata } from "@interfaces/metadata";
import { fetchingWrapperError } from "./api/utils";
export { mapStrapiSeoToMetadata } from "./metadata/seo";

export const buildMetadata = async (
  props?: CustomMetadata,
  index = true,
  follow?: boolean,
  origin?: string
): Promise<Metadata> =>
  fetchingWrapperError<Metadata>({
    errorMessage: "Error building metadata",
    callback: () => {
      if (!origin) throw new Error("Origin domain not found");

      const indexRobots = index && STAGE === "production";
      const followRobots = (follow ?? index) && STAGE === "production";
      const statics = URL_STATIC_RESOURCES!;
      const openGraphImg = props?.imgPath;
      const url = props?.url ?? "/";
      const imgPath = openGraphImg
        ? `${statics}/${openGraphImg?.startsWith("/") ? openGraphImg.slice(1) : openGraphImg}.webp`
        : undefined;

      return {
        ...props,
        manifest: "/manifest.webmanifest",
        metadataBase: new URL(origin),
        alternates: {
          ...props?.alternates,
          canonical: url
        },
        openGraph: {
          ...props?.openGraph,
          locale: props?.openGraph?.locale || undefined,
          url,
          title: props?.openGraph?.title ?? (props?.title || undefined),
          siteName: props?.openGraph?.siteName || undefined,
          description:
            props?.openGraph?.description ?? (props?.description || undefined),
          images: props?.openGraph?.images ?? imgPath
        },
        twitter: {
          card: "summary_large_image",
          description:
            props?.twitter?.description ?? (props?.description || undefined),
          title: props?.twitter?.title ?? (props?.title || undefined),
          images: props?.twitter?.images ?? imgPath
        },
        robots: {
          index: indexRobots,
          follow: followRobots,
          googleBot: {
            index: indexRobots,
            follow: followRobots
          }
        }
      };
    }
  });
