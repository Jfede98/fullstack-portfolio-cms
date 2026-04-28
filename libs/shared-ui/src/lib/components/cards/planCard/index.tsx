import { type FC, useState } from "react";
import clsx from "clsx";
import { PlanCardStyle } from "@shared-ui/components/cards/planCard/style";
import { Dropdown } from "@shared-ui/components/dropdown";
import { Icon } from "@shared-ui/components/icons";
import { Button } from "@shared-ui/components/button";
import { Badge } from "@shared-ui/components/badge";
import { MarkdownItem } from "@shared-ui/components/markdown";
import { BenefitsAndApps } from "@shared-ui/components/cards/benefitsAndApps";
import { CustomIcon } from "@shared-ui/components/customIcon";
import type {
  ICTAButtons,
  IFeature,
  IPlanCardClassName,
  IPlanCardProps
} from "@shared-ui/interfaces/cards/planCard.ts";

//TODO: Revisar las interfaces

type Slots = ReturnType<typeof PlanCardStyle>;

type TDefaultTopProps = {
  slots: Slots;
  className?: IPlanCardClassName;
  name: string;
  speedValue: string;
  speedUnit: string;
  priceInfo: IPlanCardProps["priceInfo"];
  ctaButtons: ICTAButtons[];
  isRecommended?: boolean;
  onlyPrimaryCta?: boolean;
  withTestIds?: boolean;
};

type TDefaultDetailsProps = {
  slots: Slots;
  className?: IPlanCardClassName;
  benefits: IFeature[];
  apps: IFeature[];
  detailsContent?: string;
  triggerOnClick?: () => void;
  triggerOnActive?: (active: boolean) => void;
  includeMobileBenefits?: boolean;
};

type TMobileAccordionProps = {
  slots: Slots;
  className?: IPlanCardClassName;
  name: string;
  speedValue: string;
  speedUnit: string;
  priceInfo: IPlanCardProps["priceInfo"];
  benefits: IFeature[];
  primaryCta?: ICTAButtons;
  active: boolean;
  onActive: (active: boolean) => void;
};

type TPricingDesktopProps = {
  slots: Slots;
  className?: IPlanCardClassName;
  name: string;
  speedValue: string;
  speedUnit: string;
  priceInfo: IPlanCardProps["priceInfo"];
  benefits: IFeature[];
  apps: IFeature[];
  detailsContent?: string;
  triggerOnClick?: () => void;
  triggerOnActive?: (active: boolean) => void;
};

const splitAmount = (amount: string) => {
  const amountParts = amount.match(/^(.*[,.])(\d+)([^0-9]*)$/);
  return {
    amountMain: amountParts ? amountParts[1] : amount,
    amountAfterSeparator: amountParts
      ? `${amountParts[2]}${amountParts[3] ?? ""}`
      : ""
  };
};

const getIconName = (icon?: IFeature["icon"]): string =>
  typeof icon === "string" ? icon : (icon?.name ?? "");

const getIconProps = (icon?: IFeature["icon"]) =>
  typeof icon === "string"
    ? { name: icon }
    : { name: icon?.name ?? "", type: icon?.type, size: icon?.size };

const RecommendedBadge: FC<{
  slots: Slots;
  className?: IPlanCardClassName;
  isRecommended?: boolean;
  isRecommendedText: string;
}> = ({ slots, className, isRecommended, isRecommendedText }) => {
  const { topBadge } = slots;
  if (!isRecommended) return null;

  return (
    <div data-testid="plan-card-badge">
      <Badge
        className={{ base: clsx(topBadge(), className?.topBadge) }}
        color="primary"
        isFeatured
        text={isRecommendedText}
      />
    </div>
  );
};

const DefaultTopSection: FC<TDefaultTopProps> = ({
  slots,
  className,
  name,
  speedValue,
  speedUnit,
  priceInfo,
  ctaButtons,
  isRecommended,
  onlyPrimaryCta = false,
  withTestIds = false
}) => {
  const {
    topContainer,
    speedContainer,
    speedText,
    planNameText,
    badge,
    badgeText,
    amountContainer,
    amountText,
    amountImp,
    originalPrice,
    legalDisclaimer,
    btnContainer
  } = slots;

  const renderedCtas = onlyPrimaryCta ? ctaButtons.slice(0, 1) : ctaButtons;

  return (
    <div
      className={clsx(topContainer(), className?.topContainer)}
      data-testid={withTestIds ? "plan-card-top-container" : undefined}
    >
      <div
        className={clsx(speedContainer(), className?.speedContainer)}
        data-testid={withTestIds ? "plan-card-speed-container" : undefined}
      >
        <div
          className={clsx(speedText(), className?.speedText)}
          data-testid={withTestIds ? "plan-card-speed-value" : undefined}
        >
          {speedValue}
        </div>
        <div
          className={clsx(speedText(), className?.speedText)}
          data-testid={withTestIds ? "plan-card-speed-unit" : undefined}
        >
          {speedUnit}
        </div>
      </div>

      <div
        className={clsx(planNameText(), className?.planNameText)}
        data-testid={withTestIds ? "plan-card-name" : undefined}
      >
        {name}
      </div>

      <div
        className={clsx(badge(), className?.badge)}
        data-testid={withTestIds ? "plan-card-promo" : undefined}
      >
        <Icon name="new_releases" type="rounded" color="text-primary-900" />
        <div
          className={clsx(badgeText(), className?.badgeText)}
          data-testid={withTestIds ? "plan-card-promo-label" : undefined}
        >
          {priceInfo.promoLabel}
        </div>
      </div>

      <div
        className={clsx(amountContainer(), className?.amountContainer)}
        data-testid={withTestIds ? "plan-card-amount-container" : undefined}
      >
        <div
          className={clsx(amountText(), className?.amountText)}
          data-testid={withTestIds ? "plan-card-amount" : undefined}
        >
          {priceInfo.amount}
        </div>
        <div
          className={clsx(amountImp(), className?.amountImp)}
          data-testid={withTestIds ? "plan-card-tax" : undefined}
        >
          {priceInfo.taxLabel}
        </div>
      </div>

      <div
        className={clsx(originalPrice(), className?.originalPrice)}
        data-testid={withTestIds ? "plan-card-original-price" : undefined}
      >
        {priceInfo.originalPrice}
      </div>

      <div
        className={clsx(legalDisclaimer(), className?.legalDisclaimer)}
        data-testid={withTestIds ? "plan-card-legal" : undefined}
      >
        {priceInfo.legalDisclaimer}
      </div>

      <div
        className={clsx(btnContainer(), className?.btnContainer)}
        data-testid={withTestIds ? "plan-card-cta-buttons" : undefined}
      >
        {renderedCtas.map((cta, index) => (
          <Button
            key={index}
            onClick={cta?.onClick}
            color={
              index === 0
                ? isRecommended
                  ? "primary"
                  : "secondary"
                : cta.type
            }
            icon={cta.icon}
            type={cta.href ? "link" : "button"}
            href={cta.href}
            target={cta.target}
          >
            {cta.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

const DefaultDetailsDropdown: FC<TDefaultDetailsProps> = ({
  slots,
  className,
  benefits,
  apps,
  detailsContent,
  triggerOnClick,
  triggerOnActive,
  includeMobileBenefits = true
}) => {
  const {
    dropdownBase,
    dropdownTrigger,
    dropdownContent,
    dropdownContentMobile,
    dropdownDetails
  } = slots;

  const hasMobileBenefitsContent =
    includeMobileBenefits && (benefits.length > 0 || apps.length > 0);
  const hasDetailsContent = Boolean(detailsContent?.trim());
  const hasContent = hasMobileBenefitsContent || hasDetailsContent;

  if (!hasContent) return null;

  return (
    <Dropdown
      onActive={triggerOnActive}
      contentPosition="inline"
      className={{
        base: dropdownBase(),
        trigger: dropdownTrigger(),
        content: "bg-gray-50"
      }}
      content={
        <div className={clsx(dropdownContent(), className?.dropdownContent)}>
          {hasMobileBenefitsContent && (
            <div
              className={clsx(
                dropdownContentMobile(),
                className?.dropdownContentMobile
              )}
            >
              <BenefitsAndApps
                benefits={benefits}
                apps={apps}
                className={className}
              />
            </div>
          )}
          {hasDetailsContent && (
            <div className={clsx(dropdownDetails(), className?.dropdownDetails)}>
              <MarkdownItem desc={detailsContent as string} />
            </div>
          )}
        </div>
      }
      trigger={
        <span className="font-medium" onClick={triggerOnClick}>
          Ver detalles
        </span>
      }
    />
  );
};

const MobileAccordionSection: FC<TMobileAccordionProps> = ({
  slots,
  className,
  name,
  speedValue,
  speedUnit,
  priceInfo,
  benefits,
  primaryCta,
  active,
  onActive
}) => {
  const {
    mobileAccordionCard,
    mobileAccordionTrigger,
    mobileAccordionHeader,
    mobileAccordionSpeedRow,
    mobileAccordionPrice,
    mobileAccordionPlanName,
    mobileAccordionContent,
    mobileAccordionBenefits,
    mobileAccordionBenefitItem,
    mobileAccordionBenefitText,
    mobileAccordionBtn
  } = slots;

  return (
    <Dropdown
      active={active}
      onActive={onActive}
      contentPosition="inline"
      hiddenArrowIcon
      className={{
        base: clsx(mobileAccordionCard(), className?.mobileAccordionCard),
        trigger: mobileAccordionTrigger(),
        content: "bg-white"
      }}
      trigger={
        <div className="w-full">
          <div className={clsx(mobileAccordionHeader(), "gap-3")}>
            <div className="min-w-0 flex-1">
              <div className={mobileAccordionSpeedRow()}>
                <div className="min-w-0 flex items-end gap-1">
                  <span className="text-[22px] leading-7 font-bold text-primary-500">
                    {speedValue}
                  </span>
                  <span className="text-[22px] leading-7 font-bold text-primary-500">
                    {speedUnit}
                  </span>
                </div>
                <span className={mobileAccordionPrice()}>
                  {priceInfo.amount} {priceInfo.taxLabel}
                </span>
              </div>
              <div className={mobileAccordionPlanName()}>{name}</div>
            </div>
            <Icon
              name={active ? "keyboard_arrow_up" : "keyboard_arrow_down"}
              type="rounded"
              size="msm"
              className={{ base: "text-black ml-auto shrink-0" }}
            />
          </div>
        </div>
      }
      content={
        <div className={mobileAccordionContent()}>
          <div className={mobileAccordionBenefits()}>
            {benefits.slice(0, 2).map((benefit, index) => (
              <div
                key={`mobile-accordion-benefit-${benefit.name}-${index}`}
                className={mobileAccordionBenefitItem()}
              >
                <Icon
                  name="check_circle"
                  type="rounded"
                  size="xs"
                  className={{ base: "leading-4 text-primary-500" }}
                />
                <span className={mobileAccordionBenefitText()}>{benefit.name}</span>
              </div>
            ))}
          </div>
          {primaryCta && (
            <div className={mobileAccordionBtn()}>
              <Button
                type={primaryCta.href ? "link" : "button"}
                href={primaryCta.href}
                target={primaryCta.target}
                onClick={primaryCta.onClick}
                color="secondary"
                className={{ base: "h-8 rounded-sm py-2" }}
              >
                {primaryCta.label}
              </Button>
            </div>
          )}
        </div>
      }
    />
  );
};

const PricingDesktopSection: FC<TPricingDesktopProps> = ({
  slots,
  name,
  speedValue,
  speedUnit,
  priceInfo,
  benefits,
  apps,
  detailsContent,
  triggerOnClick,
  triggerOnActive
}) => {
  const {
    pricingWrapper,
    pricingTop,
    pricingSpeedRow,
    pricingSpeedText,
    pricingPlanName,
    pricingAmountRow,
    pricingAmount,
    pricingAmountDecimal,
    pricingTax,
    pricingOriginal,
    pricingLegal,
    pricingMiddle,
    pricingBenefits,
    pricingBenefitItem,
    pricingBenefitText,
    pricingIncludesLabel,
    pricingIncludes,
    pricingAppItem,
    pricingAppName,
    pricingAppDesc,
    pricingFooterBase,
    pricingFooterTrigger,
    pricingFooterContent
  } = slots;

  const { amountMain, amountAfterSeparator } = splitAmount(priceInfo.amount);

  return (
    <div className={pricingWrapper()}>
      <div className={pricingTop()}>
        <div className={pricingSpeedRow()}>
          <span className={pricingSpeedText()}>{speedValue}</span>
          <span className={pricingSpeedText()}>{speedUnit}</span>
        </div>
        <div className={pricingPlanName()}>{name}</div>
        <div className={pricingAmountRow()}>
          <span className={pricingAmount()}>{amountMain}</span>
          {amountAfterSeparator && (
            <span className={pricingAmountDecimal()}>{amountAfterSeparator}</span>
          )}
          <span className={pricingTax()}>{priceInfo.taxLabel}</span>
        </div>
        <div className={pricingOriginal()}>{priceInfo.originalPrice}</div>
        <div className={pricingLegal()}>{priceInfo.legalDisclaimer}</div>
      </div>

      <div className={pricingMiddle()}>
        <div className={pricingBenefits()}>
          {benefits.slice(0, 2).map((benefit, index) => (
            <div
              key={`pricing-benefit-${benefit.name}-${index}`}
              className={pricingBenefitItem()}
            >
              <Icon
                name="check_circle"
                type="rounded"
                size="xs"
                className={{ base: "leading-4 text-primary-500" }}
              />
              <span className={pricingBenefitText()}>{benefit.name}</span>
            </div>
          ))}
        </div>

              {apps.length > 0 && (
          <>
            <div className={pricingIncludesLabel()}>Incluye:</div>
            <div className={pricingIncludes()}>
              {apps.slice(0, 4).map((app, index) => (
                <div
                  key={`pricing-app-${app.name}-${index}`}
                  className={pricingAppItem()}
                >
                  {(() => {
                    const iconName = getIconName(app.icon);
                    const usesCustomIcon = app.useCustomIcon !== false;
                    const customIconSrc =
                      app.url ||
                      (app.customIcon
                        ? `/assets/svg/${app.customIcon}.svg`
                        : iconName
                          ? `/assets/svg/${iconName}.svg`
                          : "");
                    const iconProps = getIconProps(app.icon);

                    if (usesCustomIcon && customIconSrc) {
                      return (
                        <CustomIcon
                          name={app.name ?? `app-${index}`}
                          imageUrl={customIconSrc}
                          imageAlt={app.imageAlt ?? app.name ?? "app"}
                          size={32}
                        />
                      );
                    }

                    if (iconName) {
                      return (
                        <Icon
                          {...iconProps}
                          color="text-primary-500"
                          className={{
                            base: "inline-flex h-8 w-8 items-center justify-center leading-none"
                          }}
                        />
                      );
                    }

                    return null;
                  })()}
                  <span className={pricingAppName()}>{app.name}</span>
                  {app.description && (
                    <span className={pricingAppDesc()}>{app.description}</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Dropdown
        onActive={triggerOnActive}
        contentPosition="inline"
        className={{
          base: pricingFooterBase(),
          trigger: pricingFooterTrigger(),
          content: pricingFooterContent()
        }}
        content={detailsContent ? <MarkdownItem desc={detailsContent} /> : null}
        trigger={
          <span className="font-medium" onClick={triggerOnClick}>
            Ver detalles
          </span>
        }
      />
    </div>
  );
};

export const PlanCard: FC<IPlanCardProps> = ({
  name,
  speedValue,
  speedUnit,
  isRecommended,
  isRecommendedText = "MÁS POPULAR",
  priceInfo,
  ctaButtons,
  benefits,
  apps,
  detailsContent,
  className,
  triggerOnClick,
  triggerOnActive,
  desktopPresentation = "default",
  mobilePresentation = "default",
  mobileAccordionActive
}) => {
  const slots = PlanCardStyle();
  const { wrapper, midContainer } = slots;
  const normalizedClassName =
    desktopPresentation === "mobile"
      ? {
          ...className,
          mobileAccordionCard: [
            "w-full",
            "max-w-full",
            className?.mobileAccordionCard
          ]
            .filter(Boolean)
            .join(" ")
        }
      : className;

  const [internalMobileAccordionActive, setInternalMobileAccordionActive] =
    useState(false);
  const mobileAccordionIsActive =
    mobileAccordionActive ?? internalMobileAccordionActive;

  const handleMobileAccordionActive = (active: boolean) => {
    if (mobileAccordionActive === undefined) {
      setInternalMobileAccordionActive(active);
    }
    triggerOnActive?.(active);
  };

  const primaryCta = ctaButtons[0];
  const isDefaultPresentation =
    desktopPresentation === "default" && mobilePresentation === "default";

  if (isDefaultPresentation && desktopPresentation === "default") {
    return (
      <div
        className={clsx(wrapper(), "relative", className?.wrapper)}
        data-testid="plan-card-wrapper"
      >
        <RecommendedBadge
          slots={slots}
          className={normalizedClassName}
          isRecommended={isRecommended}
          isRecommendedText={isRecommendedText}
        />

        <DefaultTopSection
          slots={slots}
          className={normalizedClassName}
          name={name}
          speedValue={speedValue as string}
          speedUnit={speedUnit as string}
          priceInfo={priceInfo}
          ctaButtons={ctaButtons}
          isRecommended={isRecommended}
          withTestIds
        />

        <div
          className={clsx("hidden md:block", midContainer(), className?.midContainer)}
          data-testid="plan-card-benefits"
        >
          <BenefitsAndApps benefits={benefits} apps={apps} className={className} />
        </div>

        <DefaultDetailsDropdown
          slots={slots}
          className={normalizedClassName}
          benefits={benefits}
          apps={apps}
          detailsContent={detailsContent}
          triggerOnClick={triggerOnClick}
          triggerOnActive={triggerOnActive}
          includeMobileBenefits
        />
      </div>
    );
  }

  return (
    <div
      className={clsx(wrapper(), "relative", className?.wrapper)}
      data-testid="plan-card-wrapper"
    >
      <RecommendedBadge
        slots={slots}
        className={normalizedClassName}
        isRecommended={isRecommended}
        isRecommendedText={isRecommendedText}
      />

      {mobilePresentation === "default" && (
        <div className={desktopPresentation === "mobile" ? "block" : "md:hidden"}>
          <DefaultTopSection
            slots={slots}
          className={normalizedClassName}
          name={name}
            speedValue={speedValue as string}
            speedUnit={speedUnit as string}
            priceInfo={priceInfo}
            ctaButtons={ctaButtons}
            isRecommended={isRecommended}
          />
          <DefaultDetailsDropdown
            slots={slots}
            className={normalizedClassName}
            benefits={benefits}
            apps={apps}
            detailsContent={detailsContent}
            triggerOnClick={triggerOnClick}
            triggerOnActive={triggerOnActive}
            includeMobileBenefits
          />
        </div>
      )}

      {mobilePresentation === "accordion" && (
        <div className={desktopPresentation === "mobile" ? "block" : "md:hidden"}>
          <MobileAccordionSection
            slots={slots}
            className={normalizedClassName}
            name={name}
            speedValue={speedValue as string}
            speedUnit={speedUnit as string}
            priceInfo={priceInfo}
            benefits={benefits}
            primaryCta={primaryCta}
            active={mobileAccordionIsActive}
            onActive={handleMobileAccordionActive}
          />
        </div>
      )}

      {desktopPresentation !== "mobile" && (
        <div className="hidden md:block">
        {desktopPresentation === "default" && (
          <>
            <DefaultTopSection
              slots={slots}
              className={normalizedClassName}
              name={name}
              speedValue={speedValue as string}
              speedUnit={speedUnit as string}
              priceInfo={priceInfo}
              ctaButtons={ctaButtons}
              isRecommended={isRecommended}
            />
            <div className={clsx(midContainer(), normalizedClassName?.midContainer)}>
              <BenefitsAndApps
                benefits={benefits}
                apps={apps}
                className={normalizedClassName}
              />
            </div>
            <DefaultDetailsDropdown
              slots={slots}
              className={normalizedClassName}
              benefits={benefits}
              apps={apps}
              detailsContent={detailsContent}
              triggerOnClick={triggerOnClick}
              triggerOnActive={triggerOnActive}
              includeMobileBenefits={false}
            />
          </>
        )}

        {desktopPresentation === "trimmed" && (
          <DefaultTopSection
            slots={slots}
            className={normalizedClassName}
            name={name}
            speedValue={speedValue as string}
            speedUnit={speedUnit as string}
            priceInfo={priceInfo}
            ctaButtons={ctaButtons}
            isRecommended={isRecommended}
            onlyPrimaryCta
          />
        )}

        {desktopPresentation === "pricing" && (
          <PricingDesktopSection
            slots={slots}
            className={normalizedClassName}
            name={name}
            speedValue={speedValue as string}
            speedUnit={speedUnit as string}
            priceInfo={priceInfo}
            benefits={benefits}
            apps={apps}
            detailsContent={detailsContent}
            triggerOnClick={triggerOnClick}
            triggerOnActive={triggerOnActive}
          />
        )}
      </div>
      )}
    </div>
  );
};
