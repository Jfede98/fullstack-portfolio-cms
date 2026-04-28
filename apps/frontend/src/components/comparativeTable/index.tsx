"use client";

import type { FC } from "react";
import type { IComparativeTableProps } from "@interfaces/components/comparativeTable";
import {
  ComparativeTable as ComparativeTableUI,
  Constants
} from "@sitio-publico/shared-ui";
import { useComparativeTable } from "@hooks/useComparativeTable";

export const ComparativeTable: FC<IComparativeTableProps> = ({
  title,
  subtitle,
  comparative,
  sections,
  titleTable
}) => {
  const { handlerButton, containerRef } = useComparativeTable(sections);

  const titleProps = title
    ? {
        tag: title.tag ?? "h2",
        variant: "h2" as const,
        type: "regular" as const,
        children: title.text
      }
    : undefined;

  const subtitleProps = subtitle
    ? {
        tag: subtitle.tag ?? "h3",
        variant: "body" as const,
        type: "regular" as const,
        children: subtitle.text
      }
    : undefined;

  const titleTableProps = titleTable
    ? {
        tag: titleTable.tag ?? "span",
        variant: "h2" as const,
        type: "regular" as const,
        children: titleTable.text
      }
    : undefined;

  const sectionsWithHandlers = sections?.map((section, sectionIndex) => {
    if (!section.plan) return section;

    return {
      ...section,
      plan: {
        ...section.plan,
        buttons: section.plan.buttons?.map((button) => {
          const safeButton = {
            ...(button as typeof button & { leadFormSelection?: unknown }),
          };
          if ("leadFormSelection" in safeButton) {
            delete (safeButton as { leadFormSelection?: unknown }).leadFormSelection;
          }
          return {
            ...safeButton,
            onClick: handlerButton(button, sections?.[sectionIndex])
          };
        })
      }
    };
  });

  return (
    <div ref={containerRef} className={"py-8 md:px-18 md:py-10"}>
      <ComparativeTableUI
        title={titleProps}
        subtitle={subtitleProps}
        titleTable={titleTableProps}
        comparative={comparative}
        sections={sectionsWithHandlers}
        matchMediaBreakpoint={Constants.Screen.lg}
      />
    </div>
  );
};
