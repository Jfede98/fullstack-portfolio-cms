import type { OpenGraphType } from "next/dist/lib/metadata/types/opengraph-types";
import type { CustomMetadata } from "@interfaces/metadata";

const OPEN_GRAPH_TYPES: OpenGraphType[] = [
  "website",
  "article",
  "book",
  "profile",
  "music.song",
  "music.album",
  "music.playlist",
  "music.radio_station",
  "video.movie",
  "video.episode",
  "video.tv_show",
  "video.other"
];

export const mapOpenGraphType = (
  value?: string
): OpenGraphType | undefined => {
  const normalized = value && (value.toLowerCase() as OpenGraphType);
  return normalized && OPEN_GRAPH_TYPES.includes(normalized)
    ? normalized
    : undefined;
};

export const getOpenGraphType = (
  openGraph?: CustomMetadata["openGraph"]
) => {
  const type = openGraph && (openGraph as { type?: OpenGraphType }).type;
  return type ?? undefined;
};
