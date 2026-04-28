import type { ILink } from "@shared-ui/interfaces/link";
import type { DetailedHTMLProps, ImgHTMLAttributes } from "react";

type Link = Omit<ILink, "className" | "children">;

type OfferCardClassName = {
  base?: string;
  img?: string;
  containerInfo?: string;
  title?: string;
  price?: string;
  description?: string;
  link?: string;
  arrowIcon?: string;
};

interface Href {
  href: string;
  titleHref?: string;
}

type NativeImage = Omit<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
  "className" | "style"
>;

export interface TOfferCardProps {
  className?: OfferCardClassName;
  price?: number | null;
  title: string;
  description: string;
  image: NativeImage;
  link?: Link;
  offerHref?: Href;
}
