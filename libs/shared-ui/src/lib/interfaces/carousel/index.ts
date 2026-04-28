import type { ComponentType } from "react";
import type { SwiperProps } from "swiper/react";
import type { TArrowProps } from "@shared-ui/interfaces/carousel/arrow";
import type { INavigationProps } from "@shared-ui/interfaces/carousel/navigation";
import type { IBulletProps } from "@shared-ui/interfaces/carousel/bullet";

type NativeSwiperProps = Omit<
  SwiperProps,
  | "style"
  | "className"
  | "pagination"
  | "navigation"
  | "tag"
  | "wrapperTag"
>;

type Arrow = Omit<TArrowProps, "direction" | "id">;

type TNavigationVariants =
  | {
      type: "arrows";
      hiddenArrowOnFirstAndLast?: boolean;
    }
  | (Omit<INavigationProps, "buttons"> & {
      type: "avatars";
    });

type Navigation = TNavigationVariants & {
  leftArrow?: Arrow;
  rightArrow?: Arrow;
};

type CarouselClassName = {
  base?: string;
  swiper?: string;
  wrapper?: string;
  slide?: string;
  pagination?: string;
  navigation?: string;
};

type Pagination = Omit<
  IBulletProps,
  "className" | "onClick" | "onEnd" | "isPaused"
> & {
  duration?: number;
};

export interface ICarouselProps<T = object> extends NativeSwiperProps {
  Element?: ComponentType<T>;
  data?: Array<T>;
  pagination?: Pagination | true;
  navigation?: Navigation;
  className?: CarouselClassName;
  disabledAnimationSlide?: boolean;
}

export type TCarouselBaseProps<T = object> = Omit<
  Omit<ICarouselProps<T>, "pagination">,
  "Element" | "data"
> & {
  bulletComponent?: string;
};
