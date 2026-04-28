import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import { useId, useLayoutEffect, useRef, useState } from "react";
import type { TCarouselBaseProps } from "@shared-ui/interfaces/carousel";
import type { SwiperOptions } from "swiper/types";

export const useCarousel = (props: TCarouselBaseProps) => {
  const id = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<Swiper | null>(null);
  const [isHovered, setIsHovered] = useState(props?.disabledAnimationSlide ?? false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isCentered, setIsCentered] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isBeginning, setIsBeginning] = useState(true);

  const nextNavId = `next-${id.replace(/:/g, "")}`;
  const prevNavId = `prev-${id.replace(/:/g, "")}`;

  const onSlideChangeRef = useRef<(index: number) => void>(null);
  

  useLayoutEffect(() => {
    onSlideChangeRef.current = (index: number) => {
      setActiveIndex(index);
    };
  });

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const { on, navigation, ...restProps } = props;

    const opts: SwiperOptions = {
      ...restProps,
      modules: [Navigation],
      navigation: navigation
        ? {
            nextEl: `#${nextNavId}`,
            prevEl: `#${prevNavId}`
          }
        : false,
      on: {
        ...on,
        slideChange: (swiper) => {
          on?.slideChange?.(swiper);
          onSlideChangeRef.current?.(swiper.realIndex);
          setIsEnd(swiper.isEnd);
          setIsBeginning(swiper.isBeginning);
        },
        init: (swiper) => {
          on?.init?.(swiper);
          setIsCentered(swiper.params.centeredSlides === true);
          setIsEnd(swiper.isEnd);
          setIsBeginning(swiper.isBeginning);
        }
      }
    };

    swiperRef.current = new Swiper(containerRef.current, opts);

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy();
        swiperRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, nextNavId, prevNavId]);

  const handleBulletEnd = () => {
    const swiper = swiperRef.current;
    if (!swiper || isHovered || props?.disabledAnimationSlide) return;
    swiper.slideNext();
  };

  return {
    containerRef,
    isCentered,
    nextNavId,
    prevNavId,
    activeIndex,
    swiperRef,
    handleBulletEnd,
    isHovered,
    setIsHovered,
    isBeginning,
    isEnd
  };
};
