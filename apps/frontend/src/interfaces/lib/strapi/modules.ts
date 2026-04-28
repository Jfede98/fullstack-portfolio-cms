import type { BlockType } from "@lib/constants/state";
import type { TStrapiFooter, TStrapiNavbar } from "../menu";

export type TId = {
  readonly id: number;
};

export type TTimestamps = {
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly publishedAt: string;
};

type MetaPagination = {
  readonly page: number;
  readonly pageSize: number;
  readonly pageCount: number;
  readonly total: number;
};

export type TMeta = {
  readonly meta?: MetaPagination;
};

export type TDocumentId = string;

export type TMetadata = {
  documentId: TDocumentId;
  name: string;
};

export type BaseProps = Record<string, unknown>;
export type SectionData<T> = TSection<BlockType, T>;

export type Data<SectionProps = BaseProps> = TId &
  TTimestamps &
  TMetadata &
  Partial<TSEO> & {
    slug: string;
    section?: SectionData<SectionProps>[];
    navbarVariant?: "default" | "no_items" | "simple" | "none";
    footerVariant?: "default" | "no_items" | "simple" | "none";
  };

export type Response<T extends object> = {
  data: T;
  meta: TMeta;
};

export type DataResponse<
  T extends Data | TStrapiNavbar | TStrapiFooter | Data[] = Data
> = Response<T>;

export type TStructuredData = Record<string, unknown> | string;

type Image = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
};

type Formats = "large" | "small" | "medium" | "thumbnail";

export type TMediaFormats = {
  [x in Formats]: Image;
};

export type TMediaImage = TId &
  TMetadata &
  TTimestamps & {
    alternativeText: null;
    caption: string | null;
    width: number;
    height: number;
    formats: TMediaFormats;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: string | null;
  };

export type TOpenGraph = {
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogType?: string;
  ogImage?: TMediaImage;
};

export type TSEO = TId & {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  metaRobots: string;
  metaViewport: string;
  canonicalURL: string;
  structuredData?: TStructuredData;
  metaImage: TMediaImage;
  openGraph: TOpenGraph;
};

export type BlockName<T extends BlockType = BlockType> = `block.${T}`;

export type TSection<T extends BlockType, Props = BaseProps> = {
  __component: BlockName<T>;
  widget?: SectionData<BaseProps>;
  id: number;
} & Props;

export type TWidget = TId &
  TTimestamps & {
    name: string;
    widget: SectionData<BaseProps>[];
  };

export interface SitemapPage {
  id: number;
  documentId: string;
  slug: string;
  name: string;
  updatedAt: string;
}
