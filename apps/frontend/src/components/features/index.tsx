"use client";

import type { FC } from "react";
import { Benefits } from "@sitio-publico/shared-ui";
import type { IFeaturesProps } from "@interfaces/components/features";
import { useLeadButtonAction } from "@hooks/useLeadButtonAction";

const COMPACT_HORIZONTAL_MIN_ITEMS = 4;

export const Features: FC<IFeaturesProps> = ({ title, items = [], layout }) => {
  const { runLeadButtonAction } = useLeadButtonAction();

  const benefitsItems = items.map((item) => {
    const SIMPLE_IDENTIFIER = 2;
    const needsClickAction =
      item.identifier !== undefined && item.identifier !== SIMPLE_IDENTIFIER;

    const onClick = needsClickAction
      ? () => {
          runLeadButtonAction({
            button: {
              identifier: item.identifier,
              leadFormSelection: item.leadFormSelection
            },
            section: "features"
          });
        }
      : undefined;

    return {
      icon: item.icon || "",
      title: item.title || "",
      description: item.description || "",
      href: item.href || undefined,
      isExternal: item.isExternal ?? false,
      color: item.color ?? undefined,
      onClick
    };
  });

  const hasTitle = Boolean(title?.text?.trim());
  const compactHorizontal =
    layout !== "vertical" &&
    (!hasTitle || benefitsItems.length >= COMPACT_HORIZONTAL_MIN_ITEMS);

  if (benefitsItems.length === 0) return null;

  return (
    <Benefits
      title={compactHorizontal ? undefined : title}
      benefits={benefitsItems}
      layout={layout}
      className={
        compactHorizontal
          ? {
              base: "lg:py-0 lg:px-0 lg:gap-4",
              benefitsContainerStyle: "lg:flex-nowrap lg:gap-4",
              benefitItemStyle: "lg:max-w-none lg:flex-1 lg:gap-4 lg:py-0 lg:px-2"
            }
          : undefined
      }
    />
  );
};





