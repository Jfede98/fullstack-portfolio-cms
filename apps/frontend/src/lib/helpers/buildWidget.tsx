import type { TWidget } from "@interfaces/lib/strapi/modules";
import type { FC } from "react";
import type { TBuildWidget } from "@interfaces/lib/blocks/build";

export const buildWidget: TBuildWidget = ({ block, key }) => {
  const { PageBlock } = require("./blocks") as typeof import("./blocks");
  const WidgetEntry = PageBlock["block.widget"];
  if (!WidgetEntry) return null;
  const { component } = WidgetEntry;
  const WidgetComp = component as FC;

  return (
    <WidgetComp
      key={`widget-${key}`}
      {...(block?.widget as unknown as TWidget)}
    />
  );
};
