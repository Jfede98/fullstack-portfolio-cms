import type { FC } from "react";
import { Button } from "@shared-ui/components/button";
import { BackgroundBenefitsStyle } from "@shared-ui/components/CTABenefits/style";
import type { ICTABenefitsProps } from "@shared-ui/interfaces/CTABenefits";
import { Icon } from "@shared-ui/components/icons";
import { Typography } from "@shared-ui/components/typography";
import clsx from "clsx";

export const CTABenefits: FC<ICTABenefitsProps> = ({
  title,
  subtitle,
  features,
  backgroundImage,
  className,
  icon,
  button,
  layout = "vertical",
  horizontalAlignment = "left"
}) => {
  const titleText = title.text;
  const titleTag = title.tag;
  const {
    base,
    wrapper,
    subtitleStyle,
    titleStyle,
    featuresContainer,
    featureItem,
    featureText,
    horizontalContainer,
    contentSection,
    buttonSection
  } = BackgroundBenefitsStyle();

  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }
    : {};

  const isHorizontal = layout === "horizontal";
  const isLeft = horizontalAlignment === "left";

  const ContentBlock = () => (
    <div className={clsx(contentSection(), isHorizontal && "text-left")}>
      <Typography
        tag={titleTag}
        variant="h1"
        type="regular"
        className={{ base: clsx(titleStyle(), className?.title) }}
      >
        {titleText}
      </Typography>
      <Typography
        tag="p"
        variant="body"
        type="regular"
        className={{ base: clsx(subtitleStyle(), className?.subtitle) }}
      >
        {subtitle}
      </Typography>
    </div>
  );

  const ButtonBlock = () => (
    <div className={clsx(buttonSection(), isHorizontal && "flex justify-center items-center")}>
      <Button
        {...button}
        color={button?.color ?? "secondary"}
        size={button?.size ?? "fit"}
      />
    </div>
  );

  const FeaturesBlock = () => (
    features && features.length > 0 ? (
      <div className={clsx(featuresContainer(), className?.featuresContainer)}>
        {features.map((feature, index) => (
          <div
            key={`${feature.iconName}-${index}`}
            className={clsx(featureItem(), className?.featureItem)}
          >
            <Icon
              name={feature.iconName}
              color={icon?.color || "text-white"}
              size={icon?.size || "msm"}
              type={icon?.type}
            />
            <div className={clsx(featureText(), className?.featureText)}>
              {feature.text}
            </div>
          </div>
        ))}
      </div>
    ) : null
  );

  return (
    <div
      className={clsx(wrapper(), className?.wrapper)}
      style={backgroundStyle}
    >
      <div className={clsx(
        base(), 
        className?.base,
        isHorizontal && horizontalContainer()
      )}>
        {isHorizontal ? (
          <>
            {isLeft ? (
              <>
                <ContentBlock />
                <ButtonBlock />
              </>
            ) : (
              <>
                <ButtonBlock />
                <ContentBlock />
              </>
            )}
            <FeaturesBlock />
          </>
        ) : (
          <>
            <ContentBlock />
            <ButtonBlock />
            <FeaturesBlock />
          </>
        )}
      </div>
    </div>
  );
};
