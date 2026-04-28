import type { FC } from "react";
import { Card } from "@shared-ui/components/cards/base";
import { InfoCardStyle } from "./style";
import type { IInfoCardProps } from "@shared-ui/interfaces/cards/infoCard";
import clsx from "clsx";

export const InfoCard: FC<IInfoCardProps> = ({
  image,
  imageAlt,
  title,
  description,
  className
}) => {
  const { container, image: imageStyle, title: titleStyle, description: descriptionStyle } = InfoCardStyle();

  return (
    <Card
      className={{ base: clsx(container(), className?.container) }}
      backgroundColor="gray"
      border="gray"
      dataTestid="info-card-wrapper"
    >
      {image && (
        <img
          src={image}
          alt={imageAlt || title}
          className={clsx(imageStyle(), className?.image)}
          data-testid="info-card-image"
        />
      )}

      <h3
        className={clsx(titleStyle(), className?.title)}
        style={{ color: '#1B263B' }}
        data-testid="info-card-title"
      >
        {title}
      </h3>

      <p
        className={clsx(descriptionStyle(), className?.description)}
        style={{ color: '#6A7180' }}
        data-testid="info-card-description"
      >
        {description}
      </p>
    </Card>
  );
};
