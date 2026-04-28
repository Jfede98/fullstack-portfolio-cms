import type { FC } from "react";
import { Typography } from "@shared-ui/components/typography";
import { Button } from "@shared-ui/components/button";
import type { IStreamingPlanCardProps } from "@shared-ui/interfaces/informationalSections.ts";
import { InformationalSectionStyle } from "@shared-ui/components/informationalSection/style.ts";
import clsx from "clsx";

export const InformationalSection: FC<IStreamingPlanCardProps> = ({
  title,
  subtitle,
  description,
  cta,
  image,
  className
}) => {
  const {
    wrapper,
    titleStyle,
    subtitleStyle,
    descriptionStyle,
    imageContainer,
    imageStyle,
    textContainer
  } = InformationalSectionStyle();

  const titleText = title.text;
  const titleTag = title.tag;
  const subtitleText = subtitle?.text;
  const subtitleTag = subtitle?.tag;
  const safeCta = cta
    ? {
        ...(cta as typeof cta & {
          leadFormSelection?: unknown;
        }),
      }
    : undefined;
  if (safeCta && "leadFormSelection" in safeCta) {
    delete (safeCta as { leadFormSelection?: unknown }).leadFormSelection;
  }

  return (
    <div className={clsx(wrapper(), className?.wrapper)}>
      <div className={clsx(textContainer(), className?.textContainer)}>
        <div>
          <Typography
            tag={titleTag}
            variant="h2"
            type="regular"
            className={{ base: clsx(titleStyle(), className?.titleStyle) }}
          >
            {titleText}
          </Typography>
          <Typography
            tag={subtitleTag}
            variant="h3"
            type="regular"
            className={{
              base: clsx(subtitleStyle(), className?.subtitleStyle)
            }}
          >
            {subtitleText}
          </Typography>
        </div>
        <div className={clsx(descriptionStyle(), className?.descriptionStyle)}>
          {description}
        </div>
        {cta?.children && (
          <Button
            {...safeCta}
            color={safeCta?.color ?? "secondary"}
            className={{ base: "md:max-w-[288px] w-full h-12" }}
          />
        )}
      </div>
      <div className={clsx(imageContainer(), className?.imageContainer)}>
        <img
          src={image.src}
          alt={image.alt ?? "informational-section-image"}
          className={clsx(imageStyle(), className?.imageStyle)}
        />
      </div>
    </div>
  );
};
