import type { FC } from "react";
import type { IBenefitsProps } from "@shared-ui/interfaces/benefits";
import { BenefitsStyle } from "@shared-ui/components/benefits/style";
import clsx from "clsx";
import { Icon } from "@shared-ui/components/icons";
import { Typography } from "@shared-ui/components/typography";
import type { CSSProperties } from "react";

const ICON_CONTAINER_COLOR_STYLE: Record<string, CSSProperties> = {
  secondary: { backgroundColor: "var(--color-secondary-50)" },
  tertiary:  { backgroundColor: "var(--color-tertiary-50)" },
  outline:   { backgroundColor: "transparent", border: "1px solid var(--color-primary-300)" },
  noBorder:  { backgroundColor: "transparent" },
  whatsapp:  { backgroundColor: "var(--color-green-50)" },
};

export const Benefits: FC<IBenefitsProps> = ({
  title,
  benefits,
  className,
  icon,
  layout = "horizontal"
}) => {
  const titleText = title?.text ?? "";
  const titleTag = title?.tag;
  const hasTitle = titleText.trim().length > 0;
  const {
    base,
    titleStyle,
    benefitsContainerStyle,
    benefitsTitleStyle,
    benefitsDescriptionStyle,
    benefitsIconContainer,
    benefitItemStyle,
    benefitContentStyle
  } = BenefitsStyle({ layout });

  return (
    <section
      className={clsx("ui-benefits", base(), className?.base)}
      data-testid="benefits"
    >
      {hasTitle && (
        <Typography
          tag={titleTag}
          variant="hero"
          small
          type="regular"
          className={{ base: clsx(titleStyle(), className?.titleStyle) }}
          dataTestid="benefits-title"
        >
          {titleText}
        </Typography>
      )}
      <div
        className={clsx(
          benefitsContainerStyle(),
          className?.benefitsContainerStyle
        )}
        data-testid="benefits-container"
      >
        {benefits.map((benefit, index) => {
          const titleText = benefit.title?.trim() ?? "";
          const descriptionText = benefit.description?.trim() ?? "";
          const hasTitle = titleText.length > 0;
          const hasDescription = descriptionText.length > 0;
          const hasHref = Boolean(benefit.href?.trim());
          const isExternal = benefit.isExternal ?? false;
          const hasOnClick = Boolean(benefit.onClick);
          const colorStyle = benefit.color
            ? (ICON_CONTAINER_COLOR_STYLE[benefit.color] ?? undefined)
            : undefined;

          const itemContent = (
            <>
              <div
                className={clsx(
                  benefitsIconContainer(),
                  className?.benefitsIconContainer
                )}
                style={colorStyle}
                data-testid="benefit-icon-container"
              >
                <Icon
                  name={benefit.icon}
                  size={icon?.size || "xl"}
                  color={icon?.color || "text-primary-500"}
                  type={icon?.type}
                />
              </div>
              {(hasTitle || hasDescription) && (
                <div
                  className={clsx(
                    benefitContentStyle(),
                    className?.benefitContentStyle
                  )}
                >
                  {hasTitle && (
                    <Typography
                      tag="h3"
                      variant="subtitle"
                      type="bold"
                      className={{
                        base: clsx(
                          benefitsTitleStyle(),
                          className?.benefitsTitleStyle
                        )
                      }}
                      dataTestid="benefit-title"
                    >
                      {titleText}
                    </Typography>
                  )}
                  {hasDescription && (
                    <Typography
                      tag="p"
                      variant="body"
                      type="regular"
                      className={{
                        base: clsx(
                          benefitsDescriptionStyle(),
                          className?.benefitsDescriptionStyle
                        )
                      }}
                      dataTestid="benefit-description"
                    >
                      {descriptionText}
                    </Typography>
                  )}
                </div>
              )}
            </>
          );

          const itemKey = `${benefit.icon}-${benefit.title}-${index}`;
          const itemClassName = clsx(benefitItemStyle(), className?.benefitItemStyle);

          if (hasOnClick) {
            return (
              <div
                key={itemKey}
                role="button"
                tabIndex={0}
                onClick={benefit.onClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") benefit.onClick?.();
                }}
                className={clsx(itemClassName, "cursor-pointer")}
                data-testid="benefit-item"
              >
                {itemContent}
              </div>
            );
          }

          if (hasHref) {
            return (
              <a
                key={itemKey}
                href={benefit.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className={itemClassName}
                data-testid="benefit-item"
              >
                {itemContent}
              </a>
            );
          }

          return (
            <div
              key={itemKey}
              className={itemClassName}
              data-testid="benefit-item"
            >
              {itemContent}
            </div>
          );
        })}
      </div>
    </section>
  );
};
