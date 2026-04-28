import type { FC } from "react";
import clsx from "clsx";
import { Carousel } from "@shared-ui/components/carousel/base";
import { StreamingPlanCard } from "@shared-ui/components/cards/streamingPlans/base";
import { Typography } from "@shared-ui/components/typography";
import type {
  IStreamingPlanCard,
  IStreamingPlansCarouselConfig,
  IStreamingPlansLayout,
  IStreamingPlansProps
} from "@shared-ui/interfaces/cards/streamingPlans";
import { StreamingPlansGroupStyle } from "./style";

const getLayout = (layout?: IStreamingPlansLayout) => ({
  mobile: layout?.mobile ?? "grid",
  desktop: layout?.desktop ?? "grid"
});

const getCarouselDefaults = (isDesktop: boolean) => ({
  slidesPerView: isDesktop ? 3 : 1.05,
  spaceBetween: isDesktop ? 30 : 16,
  watchOverflow: true
});

const mergeCarouselProps = (
  defaults: IStreamingPlansCarouselConfig["mobile"],
  custom?: IStreamingPlansCarouselConfig["mobile"]
) => ({
  ...defaults,
  ...custom,
  className: {
    ...defaults?.className,
    ...custom?.className
  }
});

export const StreamingPlans: FC<IStreamingPlansProps> = ({
  title,
  subtitle,
  plans,
  layout,
  carousel,
  className,
  cardClassName
}) => {
  const titleText = title.text;
  const titleTag = title.tag;
  const subtitleText = subtitle?.text;
  const subtitleTag = subtitle?.tag;
  const {
    wrapper,
    titleContainer,
    cardsContainer,
    carousel: carouselStyle,
    carouselSlide
  } = StreamingPlansGroupStyle();

  const layoutConfig = getLayout(layout);

  const CardElement: FC<IStreamingPlanCard> = (plan) => (
    <StreamingPlanCard
      {...plan}
      className={cardClassName}
      dataTestid={plan.dataTestid}
    />
  );

  const renderGrid = (visibilityClass?: string) => (
    <div
      className={clsx(
        cardsContainer(),
        visibilityClass,
        className?.cardsContainer
      )}
      data-testid="streaming-plans-cards"
    >
      {plans.map((plan, index) => (
        <StreamingPlanCard
          key={`${plan.title}-${index}`}
          {...plan}
          className={cardClassName}
          dataTestid={plan.dataTestid ?? `streaming-plan-card-${index}`}
        />
      ))}
    </div>
  );

  const renderCarousel = (
    visibilityClass: string | undefined,
    config: IStreamingPlansCarouselConfig["mobile"],
    isDesktop: boolean
  ) => {
    const mergedConfig = mergeCarouselProps(
      getCarouselDefaults(isDesktop),
      config
    );
    const mergedClassName = {
      ...mergedConfig?.className,
      base: clsx(
        carouselStyle(),
        visibilityClass,
        className?.carousel,
        mergedConfig?.className?.base
      ),
      slide: clsx(
        carouselSlide(),
        mergedConfig?.className?.slide
      )
    };

    const navigationWithAdjustedArrows = mergedConfig.navigation ? {
      ...mergedConfig.navigation,
      leftArrow: {
        ...mergedConfig.navigation.leftArrow,
        className: {
          ...mergedConfig.navigation.leftArrow?.className,
          base: clsx(
            mergedConfig.navigation.leftArrow?.className?.base,
            "!-left-4 lg:!-left-4"
          )
        }
      },
      rightArrow: {
        ...mergedConfig.navigation.rightArrow,
        className: {
          ...mergedConfig.navigation.rightArrow?.className,
          base: clsx(
            mergedConfig.navigation.rightArrow?.className?.base,
            "!-right-4 lg:!-right-4"
          )
        }
      }
    } : mergedConfig.navigation;

    return (
      <Carousel
        Element={CardElement}
        data={plans}
        {...mergedConfig}
        navigation={navigationWithAdjustedArrows}
        className={mergedClassName}
      />
    );
  };

  const sameLayout = layoutConfig.mobile === layoutConfig.desktop;

  return (
    <section
      className={clsx(wrapper(), className?.wrapper)}
      data-testid="streaming-plans"
    >
      <div
        className={clsx(titleContainer(), className?.titleContainer)}
        data-testid="streaming-plans-title"
      >
        <Typography
          tag={titleTag}
          variant="h2"
          type="regular"
          className={{
            base: clsx("text-primary-900", "text-center", className?.title)
          }}
        >
          {titleText}
        </Typography>
        {subtitle && (
          <Typography
            tag={subtitleTag}
            variant="body"
            type="regular"
            className={{
              base: clsx("text-gray-400", "text-center", className?.subtitle)
            }}
          >
            {subtitleText}
          </Typography>
        )}
      </div>

      {sameLayout && layoutConfig.mobile === "grid" && renderGrid()}
      {sameLayout &&
        layoutConfig.mobile === "carousel" &&
        renderCarousel(undefined, carousel?.mobile, false)}

      {!sameLayout && (
        <>
          {layoutConfig.mobile === "grid"
            ? renderGrid("lg:hidden")
            : renderCarousel("lg:hidden", carousel?.mobile, false)}
          {layoutConfig.desktop === "grid"
            ? renderGrid("hidden lg:flex")
            : renderCarousel("hidden lg:block", carousel?.desktop, true)}
        </>
      )}
    </section>
  );
};
