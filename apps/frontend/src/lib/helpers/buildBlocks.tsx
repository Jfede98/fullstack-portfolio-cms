"use server";

import { getPageBySlug } from "@lib/api/web/page";
import type { BaseProps, TWidget } from "@interfaces/lib/strapi/modules";
import type { FC } from "react";
import { type PageType } from "@lib/constants/state";
import type {
  TBuildPageSections,
  TBuildSection
} from "@interfaces/lib/blocks/build";
import { buildWidget } from "./buildWidget";
import type { BlockComponent } from "@interfaces/lib/blocks/block";

export const buildSections: TBuildPageSections = async (data) => {
  if (!data?.section) return;
  
  const { PageBlock } = await import("./blocks");
  
  const sections = data.section;
  let isFirstVisibleBlock = true;
  
  const buildSection: TBuildSection = ({ __component, ...block }, idx = 0) => {
    const Block = (PageBlock as BlockComponent)[__component];
    if (!Block) return null;
    const { component, mapper } = Block;
    
    let props = mapper(block as never) as BaseProps;
    
    if (!props) return null;
    
    const Component = component as FC;
    const key = `block-${props?.id}-${idx}`;
    
    // Detectar si es el primer bloque visible y es CentersPageBlock o FAQs
    if (isFirstVisibleBlock && (__component === 'block.centers-page-block' || __component === 'block.fa-qs')) {
      props = {
        ...props,
        isFirstBlock: true
      };
    }
    
    if (block?.widget) {
      props = {
        ...props,
        widgetComponent: buildWidget({ block: block as unknown as TWidget, key })
      };
    }
    
    return <Component key={key} {...props} />;
  };
  
  return sections.map((section, idx) => {
    const builtSection = buildSection(section, idx);
    
    // Si este bloque se renderiza correctamente, ya no es el primer bloque visible
    if (builtSection && isFirstVisibleBlock) {
      isFirstVisibleBlock = false;
    }
    
    return builtSection;
  });
};

export const buildPageSections = async (
  type: PageType.HOME | string,
  pLevel?: number
) => {
  if (!type) throw new Error("Page type is required");

  const data = await getPageBySlug({
    pageUID: type
  });

  return await buildSections(data);
};
