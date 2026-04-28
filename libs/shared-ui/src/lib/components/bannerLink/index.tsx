"use client";

import { Button } from "@shared-ui/components/button";
import { Typography } from "@shared-ui/components/typography";
import { Screen } from "@shared-ui/constants/state";
import { useMatchMedia } from "@shared-ui/hooks/useMatchMedia";
import type { IButtonProps } from "@shared-ui/interfaces/button";
import type { ITypographyProps } from "@shared-ui/interfaces/typography";
import clsx from "clsx";
import Image from "next/image";

type BannerLinkDeviceContent = {
  image: string;
  enableOverlay?: boolean;
  title?: {
    text?: string;
    tag?: ITypographyProps["tag"];
  };
  subtitle?: {
    text?: string;
    tag?: ITypographyProps["tag"];
  };
  ctaButton?: IButtonProps;
  useManualLink?: boolean;
  link?: string;
  isExternal?: boolean;
};

export interface BannerLinkProps {
  desktop: BannerLinkDeviceContent;
  mobile: BannerLinkDeviceContent;
}

const BannerLayer = ({
  data,
  className
}: {
  data: BannerLinkDeviceContent;
  className?: string;
}) => {
  const { isDesktop } = useMatchMedia(Screen.md);
  const hasTitle = Boolean(data.title?.text);
  const hasSubtitle = Boolean(data.subtitle?.text);
  const hasCta = Boolean(data.ctaButton);
  const ctaClassName = isDesktop
    ? "w-auto min-w-48 px-8"
    : "w-1/2 max-w-40 mx-auto";

  const content = (
    <div className={clsx("relative w-full", className)}>
      <Image
        src={data.image}
        alt="Banner"
        width={1920}
        height={1080}
        sizes="100vw"
        className="w-full h-auto"
      />
      {data.enableOverlay && (
        <div
          aria-hidden
          className="absolute inset-0 bg-primary-1000/70"
        />
      )}
      {(hasTitle || hasSubtitle || hasCta) && (
        <div className="absolute inset-0 z-10 flex items-end justify-center pt-12 pb-8 lg:items-center lg:pt-16 lg:pb-8">
          <div className="flex w-full max-w-[1224px] px-4 lg:px-8 2xl:px-0">
            <div className="flex w-full max-w-[536px] flex-col gap-4 lg:gap-6">
              {hasTitle && (
                <Typography
                  tag={data.title?.tag ?? "h2"}
                  variant={isDesktop ? "hero" : "h1"}
                  type="regular"
                  className={{ base: "text-secondary leading-tight" }}
                >
                  {data.title?.text}
                </Typography>
              )}
              {hasSubtitle && (
                <Typography
                  tag={data.subtitle?.tag ?? "p"}
                  variant={isDesktop ? "h2" : "h3"}
                  type="regular"
                  className={{ base: "text-primary-50 leading-tight" }}
                >
                  {data.subtitle?.text}
                </Typography>
              )}
              {data.ctaButton && (
                <div className="flex w-full justify-start">
                  <Button
                    {...data.ctaButton}
                    className={{
                      base: clsx(ctaClassName, data.ctaButton.className?.base),
                      loading: data.ctaButton.className?.loading
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (!data.link || hasCta) return content;

  if (data.isExternal) {
    return (
      <a
        href={data.link}
        target="_blank"
        rel="noopener noreferrer"
        className="banner-link block"
      >
        {content}
      </a>
    );
  }

  return (
    <a href={data.link} className="banner-link block">
      {content}
    </a>
  );
};

export const BannerLink = ({ desktop, mobile }: BannerLinkProps) => {
  const desktopContent = desktop.image ? <BannerLayer data={desktop} className="hidden md:block" /> : null;
  const mobileContent = mobile.image ? <BannerLayer data={mobile} className="block md:hidden" /> : null;
  const content = (
    <>
      {desktopContent}
      {mobileContent}
    </>
  );

  if (!desktop.link && !mobile.link) {
    return (
      <div className="banner-link">
        {content}
      </div>
    );
  }

  return content;
};
