import type { FC } from "react";
import { Button } from "@shared-ui/components/button";
import { Typography } from "@shared-ui/components/typography";
import { DualButtonsStyle } from "./style";
import type { IDualButtonsProps } from "@shared-ui/interfaces/dualButtons";
import clsx from "clsx";

export const DualButtons: FC<IDualButtonsProps> = ({
  title,
  description,
  primaryButton,
  secondaryButton,
  backgroundImage,
  enableOverlay = true,
  className
}) => {
  const {
    wrapper,
    container,
    overlay,
    content,
    titleStyle,
    descriptionStyle,
    buttonsContainer
  } = DualButtonsStyle();

  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }
    : {};

  return (
    <section 
      className={clsx(wrapper(), className?.wrapper)}
      style={backgroundStyle}
    >
      {enableOverlay && backgroundImage && (
        <div className={clsx(overlay(), className?.overlay)} />
      )}
      
      <div className={clsx(container(), className?.container)}>
        <div className={clsx(content(), className?.content)}>
          {title && (
            <Typography
              tag={title.tag || "h2"}
              variant="h1"
              type="regular"
              className={{ base: clsx(titleStyle(), className?.title) }}
            >
              {title.text}
            </Typography>
          )}
          
          {description && (
            <Typography
              tag="p"
              variant="body"
              type="regular"
              className={{ base: clsx(descriptionStyle(), className?.description) }}
            >
              {description}
            </Typography>
          )}
          
          <div className={clsx(buttonsContainer(), className?.buttonsContainer)}>
            {primaryButton && (
              <Button
                {...primaryButton}
                color={primaryButton.color || "primary"}
                size={primaryButton.size || "lg"}
              />
            )}
            
            {secondaryButton && (
              <Button
                {...secondaryButton}
                color={secondaryButton.color || "secondary"}
                size={secondaryButton.size || "lg"}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};