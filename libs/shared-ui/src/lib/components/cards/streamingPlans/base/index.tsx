import type { FC } from "react";
import clsx from "clsx";
import { Card } from "@shared-ui/components/cards/base";
import { Button } from "@shared-ui/components/button";
import { Badge } from "@shared-ui/components/badge";
import { Typography } from "@shared-ui/components/typography";
import type {
  IStreamingPlanCardProps,
  IStreamingPlanCta
} from "@shared-ui/interfaces/cards/streamingPlans";
import { StreamingPlanCardStyle } from "./style";

const resolveButtonType = (cta: IStreamingPlanCta) =>
  cta.type ?? (cta.href ? "link" : "button");

export const StreamingPlanCard: FC<IStreamingPlanCardProps> = ({
  title,
  description,
  image,
  badgeText,
  ctas,
  className,
  dataTestid
}) => {
  const {
    card,
    imageWrapper,
    image: imageStyle,
    imageOverlay,
    imageGradient,
    badge,
    content,
    buttons
  } = StreamingPlanCardStyle();

  return (
    <Card
      className={{ base: clsx(card(), className?.card) }}
      dataTestid={dataTestid}
      border="white"
      backgroundColor="white"
    >
      <div
        className={clsx(imageWrapper(), className?.imageWrapper)}
        data-testid="streaming-plan-card-image"
      >
        {image.src ? (
          <img
            src={image.src}
            alt={image.alt ?? "streaming-plan"}
            className={clsx(imageStyle(), className?.image)}
          />
        ) : null}
        <div className={clsx(imageOverlay(), className?.imageOverlay)} />
        <div className={clsx(imageGradient(), className?.imageGradient)} />
        {badgeText && (
          <Badge
            text={badgeText}
            color="secondary"
            isFeatured
            className={{ base: clsx(badge(), className?.badge) }}
          />
        )}
      </div>
      <div className={clsx(content(), className?.content)}>
        <Typography
          tag="h3"
          variant="title"
          type="bold"
          className={{
            base: clsx(
              "text-primary-500",
              "w-full",
              className?.cardTitle
            )
          }}
        >{title}</Typography>

        <Typography
          tag="p"
          variant="caption"
          type="regular"
          className={{
            base: clsx(
              "text-[#2C2C30]",
              "w-full",
              className?.cardDescription
            )
          }}
        >{description}</Typography>
        <div className={clsx(buttons(), className?.buttons)}>
          {ctas.map((cta, index) => {
            const {
              label,
              className: ctaClassName,
              ...ctaProps
            } = cta;

            return (
              <Button
                key={`${index}`}
                {...ctaProps}
                type={resolveButtonType(cta)}
                className={{
                  base: clsx(
                    ctaClassName?.base,
                    index === 0 ? className?.primaryButton : undefined,
                    index === 1 ? className?.secondaryButton : undefined
                  ),
                  loading: ctaClassName?.loading
                }}
              >
                {label}
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
