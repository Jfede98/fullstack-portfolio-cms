import type { Metadata } from "next";

export type NativeMetadata = Omit<Metadata, "robots">;
export type CustomMetadata = NativeMetadata & {
  url?: string;
  imgPath?: string;
};
