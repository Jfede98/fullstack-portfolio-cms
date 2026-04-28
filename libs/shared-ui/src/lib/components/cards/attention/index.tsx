import { Icon } from "@shared-ui/components/icons";
import { Card } from "@shared-ui/components/cards/base";
import { AttentionCardStyle } from "./style";
import { Button } from "@shared-ui/components/button";
import type { IAttentionCardProps } from "@shared-ui/interfaces/cards/attentionCard.ts";
import type { FC } from "react";
import clsx from "clsx";

export const AttentionCard: FC<IAttentionCardProps> = ({
  iconName,
  title,
  text,
  button,
  className,
  icon
}) => {
  const { container, textStyle, titleStyle, buttonWrapper } =
    AttentionCardStyle();

  return (
    <div data-testid="attention-card">
      <Card className={{ base: clsx(container(), className?.container) }}>
        <Icon
          name={iconName}
          type={icon?.type || "rounded"}
          size={icon?.size || "md"}
          color={icon?.color || "text-primary-500"}
        />
        <span className={clsx(titleStyle(), className?.title)}>{title}</span>
        <span className={clsx(textStyle(), className?.text)}>{text}</span>
        <div className={clsx(buttonWrapper(), className?.button)}>
          <Button {...button} />
        </div>
      </Card>
    </div>
  );
};
