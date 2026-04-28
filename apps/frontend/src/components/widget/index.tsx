import type { TWidget } from "@interfaces/lib/strapi/modules";
import { buildSections } from "@lib/helpers/buildBlocks";
import type { FC } from "react";

export const Widget: FC<TWidget> = async ({ widget }) => {
  return (await buildSections({ section: widget })) ?? null;
};
