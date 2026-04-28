"use client";

import { type FC } from "react";
import type { IInformationalSection } from "@interfaces/components/informationalSection";
import { InformationalSection as InformationalSectionUI } from "@sitio-publico/shared-ui";
import { useInformationalSection } from "@hooks/useInformationalSection";

export const InformationalSection: FC<IInformationalSection> = (props) => {
  const { handlerCtaButton } = useInformationalSection();
  const isModalButton = props.cta?.identifier === 0;
  const safeCta = props.cta
    ? {
        ...(props.cta as typeof props.cta & { leadFormSelection?: unknown }),
      }
    : undefined;
  if (safeCta && "leadFormSelection" in safeCta) {
    delete (safeCta as { leadFormSelection?: unknown }).leadFormSelection;
  }

  return (
    <InformationalSectionUI
      {...props}
      cta={
        props.cta
          ? {
              ...safeCta,
              onClick: isModalButton
                ? () => handlerCtaButton(props.cta)
                : props.cta.onClick
            }
          : undefined
      }
    />
  );
};
