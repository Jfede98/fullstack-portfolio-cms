import type { TWidget } from "@interfaces/lib/strapi/modules";

type WidgetBlock = {
  widgets?: Array<Pick<TWidget, "widget"> | null> | null;
};

export const mapWidget = (data: WidgetBlock) => {
  const widget = data?.widgets?.flatMap((item) => item?.widget ?? []) ?? [];

  return { widget };
};
