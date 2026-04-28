import type { IServiceChannelsProps } from "@interfaces/components/serviceChannels";
import type { StrapiBlockWithItems, StrapiIcon } from "@interfaces/lib/strapi/strapi";
import { mapTypography } from "./utils";
import { mapButton } from "./button";

const getIconName = (icon?: StrapiIcon | null): string | undefined => {
  if (!icon) return undefined;
  return icon.name ?? undefined;
};

export const mapServiceChannels = (data: StrapiBlockWithItems): IServiceChannelsProps => {
  const channels = (data?.attentionCard ?? []).map((card) => {
    const mappedButton = mapButton(card.button);

    return {
      id: card.id,
      title: card.title ?? card.name ?? "",
      text: card.text ?? card.description ?? "",
      icon: getIconName(card.icon),
      button: card.button
        ? {
            label: mappedButton?.children?.toString() ?? card.button.label ?? "",
            href: mappedButton?.href ?? card.button.href,
            variant: mappedButton?.color ?? card.button.variant,
            type: mappedButton?.type ?? card.button.type
          }
        : null
    };
  });

  const shortcutsWidget = data?.shortcuts?.items ? [{
    __component: "block.shortcuts",
    items: data.shortcuts.items.map((item) => ({
      id: item.id,
      label: item.label,
      href: item.href,
      isExternal: item.isExternal,
      icon: item.icon ? {
        id: item.icon.id,
        name: item.icon.name,
        type: item.icon.type,
        size: item.icon.size
      } : null
    }))
  }] : [];

  return {
    id: data?.id,
    title: data?.title ? mapTypography(data.title) : undefined,
    channels,
    widget: shortcutsWidget.length > 0 ? {
      id: data?.shortcuts?.id,
      name: "shortcuts",
      widget: shortcutsWidget
    } : undefined
  };
};
