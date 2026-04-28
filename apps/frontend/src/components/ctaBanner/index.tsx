"use client";
import type { FC } from "react";
import type { ICTABanner } from "@interfaces/components/ctaBanner";
import { CTABenefits } from "@sitio-publico/shared-ui";
import { useCtaBanner } from "@hooks/useCtaBanner";
import { CTABannerStyle } from "./style";

export const CtaBanner: FC<ICTABanner> = ({
  title,
  subtitle,
  backgroundImage,
  features,
  button,
  layout,
  horizontalAlignment
}) => {
  const { normalizeCtaBannerFeatures, handlerCtaButton } = useCtaBanner();
  const isModalButton = button?.identifier === 0;
  const safeButton = button
    ? {
        ...(button as typeof button & {
          leadFormSelection?: unknown;
        }),
      }
    : undefined;
  if (safeButton && "leadFormSelection" in safeButton) {
    delete (safeButton as { leadFormSelection?: unknown }).leadFormSelection;
  }

  return (
    <section className={CTABannerStyle()}>
      <CTABenefits
        title={title ?? { text: "" }}
        subtitle={subtitle ?? ""}
        backgroundImage={backgroundImage}
        features={normalizeCtaBannerFeatures(features)}
        layout={layout}
        horizontalAlignment={horizontalAlignment}
        button={{
          ...safeButton,
          onClick: isModalButton ? () => handlerCtaButton(button) : button?.onClick
        }}
      />
    </section>
  );
};
