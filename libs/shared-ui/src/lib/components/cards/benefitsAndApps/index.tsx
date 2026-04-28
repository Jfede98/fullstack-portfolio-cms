import type { FC } from "react";
import { Icon } from "@shared-ui/components/icons";
import { CustomIcon } from "@shared-ui/components/customIcon";
import clsx from "clsx";
import type {
  IFeature,
  IBenefitsAndAppsProps
} from "@shared-ui/interfaces/cards/planCard.ts";
import { BenefitsAndAppsCardStyle } from "@shared-ui/components/cards/benefitsAndApps/style";

const getIconName = (icon?: IFeature["icon"]): string =>
  typeof icon === "string" ? icon : (icon?.name ?? "");

const getIconProps = (icon?: IFeature["icon"]) =>
  typeof icon === "string"
    ? { name: icon }
    : { name: icon?.name ?? "", type: icon?.type, size: icon?.size };

export const BenefitsAndApps: FC<IBenefitsAndAppsProps> = ({
  benefits = [],
  apps = [],
  className
}) => {
  const {
    divider,
    benefitsContainer,
    benefitItem,
    benefitIconWrapper,
    benefitText,
    appsLabel,
    appsContainer,
    appItem,
    appImage,
    appName,
    appDescription
  } = BenefitsAndAppsCardStyle();

  return (
    <>
      {benefits.length > 0 && (
        <div
          data-testid="benefits-container"
          className={clsx(benefitsContainer(), className?.benefitsContainer)}
        >
          {benefits.map((benefit: IFeature, index: number) => (
            <div
              key={`benefit-${benefit.name}-${index}`}
              data-testid={`benefit-item-${index}`}
              className={clsx(benefitItem(), className?.benefitItem)}
            >
              <div
                className={clsx(
                  benefitIconWrapper(),
                  className?.benefitIconWrapper
                )}
              >
                <Icon
                  name={getIconName(benefit.icon) || "check_circle"}
                  type={"rounded"}
                  color={"text-primary-500"}
                  size={"msm"}
                />
              </div>
              <span className={clsx(benefitText(), className?.benefitText)}>
                {benefit.name}
              </span>
            </div>
          ))}
        </div>
      )}
      {apps.length > 0 && (
        <>
          <div
            data-testid="apps-label"
            className={clsx(appsLabel(), className?.appsLabel)}
          >
            Incluye:
          </div>
          <div
            data-testid="apps-container"
            className={clsx(appsContainer(), className?.appsContainer)}
          >
            {apps.map((app: IFeature, index: number) => {
              const iconName = getIconName(app.icon);
              const usesCustomIcon = app.useCustomIcon !== false;

              /**TODO: Borrar este /assets/svg quemado, debe llegar por props */

              const customIconSrc =
                app.url ||
                (app.customIcon
                  ? `/assets/svg/${app.customIcon}.svg`
                  : iconName
                    ? `/assets/svg/${iconName}.svg`
                    : "");
              const customIconAlt =
                app.imageAlt ?? `icon-${app.customIcon ?? iconName}`;
              const iconProps = getIconProps(app.icon);

              return (
                <div
                  data-testid={`app-item-${index}`}
                  key={index}
                  className={clsx(appItem(), className?.appItem)}
                >
                  {usesCustomIcon && customIconSrc ? (
                    <CustomIcon
                      name={app.name ?? "custom-icon"}
                      imageUrl={customIconSrc}
                      imageAlt={customIconAlt}
                      size={32}
                      className={clsx(appImage(), className?.appImage)}
                    />
                  ) : (
                    iconName && (
                      <Icon
                        {...iconProps}
                        color="text-primary-500"
                        className={{
                          base: clsx(
                            appImage(),
                            className?.appImage,
                            "inline-flex items-center justify-center leading-none"
                          )
                        }}
                      />
                    )
                  )}
                  <span className={clsx(appName(), className?.appName)}>
                    {app.name}
                  </span>
                  <span
                    className={clsx(
                      appDescription(),
                      className?.appDescription
                    )}
                  >
                    {app.description}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
      <div
        className={clsx(divider(), className?.divider)}
        data-testid="divider"
      />
    </>
  );
};
