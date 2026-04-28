import type { FC } from "react";
import { useState } from "react";
import clsx from "clsx";
import { MapComponent } from "@shared-ui/components/mapComponent";
import { AttentionCenterCard } from "@shared-ui/components/cards/attentionCenter";
import { CentersLayoutStyle } from "./style";
import type { ICentersLayoutProps } from "@shared-ui/interfaces/centersLayout";

export const CentersLayout: FC<ICentersLayoutProps> = ({
  mapConfig,
  centers,
  mobileMapButtonLabel,
  mobileListButtonLabel,
  onCenterMapClick,
  onCenterServicesClick,
  className
}) => {
  const [mobileView, setMobileView] = useState<"map" | "list">("map");

  const {
    wrapper,
    desktopLayout,
    mapSection,
    cardsSection,
    mobileLayout,
    mobileToggle,
    mobileToggleButton,
    activeMobileToggle,
    mobileContent,
    cardsGrid,
    cardWrapper
  } = CentersLayoutStyle();

  // Convert centers to map markers
  const mapMarkers = centers.map(center => ({
    longitude: center.longitude,
    latitude: center.latitude,
    title: center.title,
    color: center.serviceType === "centro_experiencia" ? "#1B263B" : "#415A77"
  }));

  const enhancedMapConfig = {
    ...mapConfig,
    markers: mapMarkers
  };

  const handleCenterMapClick = (latitude: number, longitude: number) => {
    if (onCenterMapClick) {
      onCenterMapClick(latitude, longitude);
    }
  };

  const handleCenterServicesClick = (services: string[]) => {
    if (onCenterServicesClick) {
      onCenterServicesClick(services);
    }
  };

  return (
    <div className={clsx(wrapper(), className?.wrapper)}>
      {/* Desktop Layout - Cards LEFT, Map RIGHT */}
      <div className={clsx(desktopLayout(), className?.desktopLayout)}>
        <div className={clsx(cardsSection(), className?.cardsSection)}>
          <div className={clsx(cardsGrid(), className?.cardsGrid)}>
            {centers.map((center, index) => (
              <div key={index} className={clsx(cardWrapper(), className?.cardWrapper)}>
                <AttentionCenterCard
                  {...center}
                  onMapClick={handleCenterMapClick}
                  onServicesClick={handleCenterServicesClick}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className={clsx(mapSection(), className?.mapSection)}>
          <MapComponent {...enhancedMapConfig} />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className={clsx(mobileLayout(), className?.mobileLayout)}>
        <div className={clsx(mobileToggle(), className?.mobileToggle)}>
          <button
            className={clsx(
              mobileToggleButton(),
              mobileView === "map" && activeMobileToggle(),
              className?.mobileToggleButton,
              mobileView === "map" && className?.activeMobileToggle
            )}
            onClick={() => setMobileView("map")}
          >
            {mobileMapButtonLabel}
          </button>
          
          <button
            className={clsx(
              mobileToggleButton(),
              mobileView === "list" && activeMobileToggle(),
              className?.mobileToggleButton,
              mobileView === "list" && className?.activeMobileToggle
            )}
            onClick={() => setMobileView("list")}
          >
            {mobileListButtonLabel}
          </button>
        </div>

        <div className={clsx(mobileContent(), className?.mobileContent)}>
          {mobileView === "map" ? (
            <div className="h-full rounded-lg overflow-hidden shadow-md">
              <MapComponent {...enhancedMapConfig} />
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {centers.map((center, index) => (
                <AttentionCenterCard
                  key={index}
                  {...center}
                  onMapClick={handleCenterMapClick}
                  onServicesClick={handleCenterServicesClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};