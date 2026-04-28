import type { FC } from "react";
import { Card } from "@shared-ui/components/cards/base";
import { Icon } from "@shared-ui/components/icons";
import { Typography } from "@shared-ui/components/typography";
import { SecurityTipsCardStyle } from "./style";
import type { ISecurityTipsCardProps } from "@shared-ui/interfaces/cards/securityTipsCard.ts";
import clsx from "clsx";

export const SecurityTipsCard: FC<ISecurityTipsCardProps> = ({
  title,
  description,
  linkText,
  href,
  iconName,
  icon,
  linkIconName = "chevron_right",
  linkIcon,
  className
}) => {
  const { container, titleStyle, descriptionStyle, linkStyle } =
    SecurityTipsCardStyle();

  return (
    <Card
      className={{ base: clsx(container(), className?.container) }}
      dataTestid="security-card-wrapper"
    >
      {iconName && (
        <Icon
          name={iconName}
          type={icon?.type || "filled"}
          size={icon?.size || "xl"}
          color={icon?.color || "text-primary-700"}
          dataTestid="security-card-icon"
        />
      )}

      <Typography
        tag="h3"
        variant="h3"
        type="bold"
        className={{ base: clsx(titleStyle(), className?.title) }}
        dataTestid="security-card-title"
      >{title}</Typography>

      <Typography
        tag="p"
        variant="body"
        className={{ base: clsx(descriptionStyle(), className?.description) }}
        dataTestid="security-card-description"
      >{description}</Typography>

      {href && (
        <a
          className={clsx(linkStyle(), className?.link)}
          href={href}
          data-testid="security-card-link"
        >
          <span data-testid="security-card-link-text">{linkText}</span>
          <Icon
            name={linkIconName}
            type={linkIcon?.type || "rounded"}
            size={linkIcon?.size || "msm"}
            color={linkIcon?.color || "text-primary-700"}
            dataTestid="security-card-link-icon"
          />
        </a>
      )}
    </Card>
  );
};
