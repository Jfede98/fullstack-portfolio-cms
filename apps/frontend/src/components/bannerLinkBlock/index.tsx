import { BannerLinkBlockProps } from "@lib/helpers/mappers/bannerLinkBlock";
import { BannerLink } from "@shared-ui/components/bannerLink";

export const BannerLinkBlock = ({ banners }: BannerLinkBlockProps) => {
  if (!banners?.length) return null;

  const isSlider = banners.length > 1;

  if (isSlider) {
    return (
      <div className="banner-slider">
        {banners.map((banner, index) => (
          <BannerLink key={index} {...banner} />
        ))}
      </div>
    );
  }

  return <BannerLink {...banners[0]} />;
};
