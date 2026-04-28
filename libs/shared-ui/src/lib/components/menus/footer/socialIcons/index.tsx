import { Link } from "@shared-ui/components/link";
import type { LinkSocial } from "@shared-ui/interfaces/menus/footer";
import type { FC } from "react";
import { FooterSocialIconsStyle } from "./style";

export const SocialIcons: FC<{ socialNetworks?: LinkSocial[] }> = ({
  socialNetworks
}) => {
  if (!socialNetworks || socialNetworks.length === 0) return null;
  const { wrapperSocial, iconSocialStyle } = FooterSocialIconsStyle();

  return (
    <div className={wrapperSocial()}>
      {socialNetworks?.map(
        ({ img, link }, idx) =>
          img?.src && (
            <Link key={idx} {...link} href={link?.href ?? ""}>
              <img
                key={idx}
                {...img}
                className={iconSocialStyle()}
                alt={img?.alt ?? "social-icons"}
              />
            </Link>
          )
      )}
    </div>
  );
};
