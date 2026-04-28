import type { FC } from "react";
import clsx from "clsx";
import { Card } from "@shared-ui/components/cards/base";
import { Button } from "@shared-ui/components/button";
import { Icon } from "@shared-ui/components/icons";
import { AttentionCenterCardStyle } from "./style";
import type { IAttentionCenterCardProps } from "@shared-ui/interfaces/cards/attentionCenter";

export const AttentionCenterCard: FC<IAttentionCenterCardProps> = ({
  title,
  image,
  // city, // Not used in component
  address,
  schedule,
  latitude,
  longitude,
  // serviceType, // Not used in component
  services,
  mapButton,
  servicesButton,
  onMapClick,
  onServicesClick,
  className
}) => {
  const {
    card,
    imageWrapper,
    image: imageStyle,
    content,
    title: titleStyle,
    infoContainer,
    addressContainer,
    scheduleContainer,
    infoText,
    iconWrapper,
    buttons,
    mapButton: mapButtonStyle,
    servicesButton: servicesButtonStyle
  } = AttentionCenterCardStyle();

  const handleMapClick = () => {
    if (onMapClick) {
      onMapClick(latitude, longitude);
    }
    if (mapButton?.onClick) {
      mapButton.onClick({} as any);
    }
  };

  const handleServicesClick = () => {
    if (onServicesClick) {
      onServicesClick(services);
    }
    if (servicesButton?.onClick) {
      servicesButton.onClick({} as any);
    }
  };

  return (
    <Card className={{ base: clsx(card(), className?.card) }}>
      <div className={clsx(imageWrapper(), className?.imageWrapper)}>
        {image?.src && (
          <img
            src={image.src}
            alt={image.alt ?? title}
            className={clsx(imageStyle(), className?.image)}
          />
        )}
      </div>
      
      <div className={clsx(content(), className?.content)}>
        <h3 className={clsx(titleStyle(), className?.title)}>
          {title}
        </h3>
        
        <div className={clsx(infoContainer(), className?.infoContainer)}>
          <div className={clsx(addressContainer(), className?.addressContainer)}>
            <div className={clsx(iconWrapper(), className?.iconWrapper)}>
              <Icon
                name="location_on"
                type="outlined"
                size="sm"
                color="text-[#1B263B]"
              />
            </div>
            <span className={clsx(infoText(), className?.infoText)}>
              {address}
            </span>
          </div>
          
          <div className={clsx(scheduleContainer(), className?.scheduleContainer)}>
            <div className={clsx(iconWrapper(), className?.iconWrapper)}>
              <Icon
                name="schedule"
                type="outlined"
                size="sm"
                color="text-[#1B263B]"
              />
            </div>
            <span className={clsx(infoText(), className?.infoText)}>
              {schedule}
            </span>
          </div>
        </div>
        
        <div className={clsx(buttons(), className?.buttons)}>
          <Button
            {...mapButton}
            onClick={handleMapClick}
            className={{
              base: clsx(mapButtonStyle(), className?.mapButton)
            }}
          />
          
          <Button
            {...servicesButton}
            onClick={handleServicesClick}
            className={{
              base: clsx(servicesButtonStyle(), className?.servicesButton)
            }}
          />
        </div>
      </div>
    </Card>
  );
};