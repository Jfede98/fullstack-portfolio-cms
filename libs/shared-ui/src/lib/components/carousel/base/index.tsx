import type { ICarouselProps } from "@shared-ui/interfaces/carousel";
import { Bullet } from "@shared-ui/components/carousel/bullet";
import { Navigation } from "@shared-ui/components/carousel/navigation";
import { useCarousel } from "@shared-ui/hooks/useCarousel";
import { Arrow } from "@shared-ui/components/carousel/arrow";
import { CarouselStyles } from "./style";
import clsx from "clsx";

export const Carousel = <T extends object>({
  Element,
  data,
  className,
  navigation,
  pagination,
  disabledAnimationSlide = true,
  ...props
}: ICarouselProps<T>) => {
  if (!Element || !data)
    throw new Error(
      "You need to specify the element you want to render and its properties"
    );

  const {
    base,
    swiper,
    wrapper,
    slide,
    paginationStyle,
    navigationStyle,
    navigationArrowStyle
  } = CarouselStyles();

  const {
    containerRef,
    isCentered,
    nextNavId,
    prevNavId,
    activeIndex,
    swiperRef,
    handleBulletEnd,
    isHovered,
    setIsHovered,
    isEnd,
    isBeginning
  } = useCarousel({
    ...props,
    navigation,
    disabledAnimationSlide
  });

  const durationValue =
    typeof pagination === "object" && pagination?.duration
      ? pagination.duration
      : undefined;

  return (
    <div className={clsx(base(), className?.base)}>
      <div
        ref={containerRef}
        className={clsx(swiper(), className?.base)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={clsx(wrapper(), className?.wrapper)}>
          {data?.map((item: T, idx: number) => (
            <div
              key={idx}
              className={clsx(
                slide(),
                `${isCentered ? "custom-centered-slide" : ""}`,
                className?.slide
              )}
            >
              <Element {...item} />
            </div>
          ))}
        </div>
      </div>

      {pagination && (
        <div
          className={clsx(
            paginationStyle({ pagginationHidden: props.loop }),
            className?.pagination
          )}
        >
          {data?.map((_, idx) => (
            <Bullet
              key={idx}
              active={idx === activeIndex}
              onClick={() => swiperRef.current?.slideToLoop(idx)}
              onEnd={handleBulletEnd}
              isPaused={isHovered}
              duration={durationValue}
              disabledAnimation={disabledAnimationSlide}
            />
          ))}
        </div>
      )}

      {navigation?.type === "avatars" && (
        <div className={clsx(navigationStyle(), className?.navigation)}>
          <Navigation
            {...navigation}
            buttons={[
              { ...navigation?.leftArrow, id: prevNavId, direction: "left" },
              { ...navigation?.rightArrow, id: nextNavId, direction: "right" }
            ]}
          />
        </div>
      )}

      {navigation?.type === "arrows" && (
        <>
          <Arrow
            {...navigation?.leftArrow}
            className={{
              base: clsx(
                navigationArrowStyle({
                  arrowLeft: true,
                  hiddenArrow:
                    isBeginning && navigation?.hiddenArrowOnFirstAndLast
                }),
                navigation?.leftArrow?.className?.base
              ),
              icon: navigation?.leftArrow?.className?.icon
            }}
            id={prevNavId}
            direction="left"
          />
          <Arrow
            {...navigation?.rightArrow}
            className={{
              base: clsx(
                navigationArrowStyle({
                  arrowLeft: false,
                  hiddenArrow: isEnd && navigation?.hiddenArrowOnFirstAndLast
                }),
                navigation?.rightArrow?.className?.base
              ),
              icon: navigation?.rightArrow?.className?.icon
            }}
            id={nextNavId}
            direction="right"
          />
        </>
      )}
    </div>
  );
};
