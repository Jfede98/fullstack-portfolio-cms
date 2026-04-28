import type { HeroProps, WelcomeData } from "@interfaces/components/hero";
import type { Swiper as SwiperType } from "swiper";
import { useCallback, useMemo, useState } from "react";

type THook = Pick<HeroProps, "slides" | "avatars" | "labels" | "widget">;

export const useHero = ({ slides, avatars, labels, widget }: THook) => {
  const [avatarGroup, setAvatarGroup] = useState<HeroProps["avatars"]>([]);
  const [navigationLabel, setNavigationLabel] = useState<string | undefined>();

  const widgetComponent = useMemo(() => widget, [widget]);

  const updateState = useCallback(
    (swiper: SwiperType) => {
      const pos = swiper.realIndex;

      setNavigationLabel(labels?.[pos]);

      const newAvatars = avatars?.map((a, idx) => ({
        ...a,
        active: pos === idx,
        onClick: () => {
          swiper.slideToLoop(idx);
        }
      }));

      setAvatarGroup(newAvatars);
    },
    [avatars, labels]
  );

  const handleSlideChange = useCallback(
    (swiper: SwiperType) => {
      updateState(swiper);
    },
    [updateState]
  );

  const handleInit = useCallback(
    (swiper: SwiperType) => {
      updateState(swiper);
    },
    [updateState]
  );

  const data: WelcomeData[] = slides.map(({ id, content }, index) => ({
    id,
    ...content,
    imageLoading: index === 0 ? "eager" : "lazy",
    imageFetchPriority: index === 0 ? "high" : "auto"
  }));

  return {
    navigationLabel,
    handleSlideChange,
    handleInit,
    data,
    avatarGroup,
    widgetComponent
  };
};
