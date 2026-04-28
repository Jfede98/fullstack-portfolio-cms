import type { JSX } from "react";
import type { SectionData, TWidget } from "../strapi/modules";
import type { PageResponse } from "../pages";

export type TBuildPageSections = (
  data: Partial<PageResponse>
) => Promise<(JSX.Element | null)[] | undefined>;

export type TBuildSection = (
  section: SectionData<unknown>,
  idx?: number,
  isFirstVisible?: boolean
) => JSX.Element | null;

export type TBuildWidget = (req: {
  block: TWidget;
  key: string;
}) => JSX.Element | null;
