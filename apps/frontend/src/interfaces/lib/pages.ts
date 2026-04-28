import type { CollectionType } from "@lib/constants/state";
import type { Data } from "./strapi/modules";
import type { TMenuVariant } from "@sitio-publico/shared-ui";
export type { TMenuVariant };

export type TPopulate = {
  key: string;
  value: string;
};

type TGenericProps = {
  populate?: TPopulate | null;
  revalidate?: number;
};

export type TGetPageBySlugParamsProps = TGenericProps & {
  pageUID: string;
  collection?: CollectionType;
  isMetadata?: boolean;
};

export type PageResponse = Data<unknown> | null;

export type IGetPageBySlug = (
  req: TGetPageBySlugParamsProps
) => Promise<PageResponse>;

type Params = "slug";

export type TPageArgs = {
  params: Promise<Record<Params, string[]>>;
  searchParams: Promise<unknown>;
};
