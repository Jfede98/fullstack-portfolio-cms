"use client";

import type { FC } from "react";
import { Shortcuts } from "@sitio-publico/shared-ui";
import { Typography } from "@sitio-publico/shared-ui";
import { ClientAttentionCard } from "@components/client/ClientAttentionCard";
import type { IServiceChannelsProps } from "@interfaces/components/serviceChannels";
import { serviceChannelsStyle } from "./style";

export const ServiceChannels: FC<IServiceChannelsProps> = ({
  title,
  channels,
  widget
}) => {
  const {
    container,
    title: titleStyle,
    cardsContainer
  } = serviceChannelsStyle();

  const cardItems = channels ?? [];

  const shortcutsItems =
    widget?.widget
      ?.find((w) => w.__component === "block.shortcuts")
      ?.items?.map((item) => ({
        title: item.label ?? "",
        icon: item.icon?.name ?? "home",
        href: item.href ?? "#"
      })) ?? [];

  return (
    <section className={container()}>
      {title?.text && (
        <Typography
          tag={title.tag}
          variant="h2"
          type="regular"
          className={{ base: titleStyle() }}
        >
          {title.text}
        </Typography>
      )}

      {cardItems.length > 0 && (
        <div className={cardsContainer()}>
          {cardItems.map((item, index) => (
            <ClientAttentionCard
              key={`attention-card-${index}`}
              iconName={item.icon || "phone"}
              title={item.title ?? ""}
              text={item.text ?? ""}
              href={item?.button?.href ?? ""}
              button={{
                children: item.button?.label ?? "Contactar"
              }}
              className={{
                container: "max-w-[320px] min-w-70 flex-1"
              }}
            />
          ))}
        </div>
      )}

      {shortcutsItems.length > 0 && <Shortcuts items={shortcutsItems} />}
    </section>
  );
};
