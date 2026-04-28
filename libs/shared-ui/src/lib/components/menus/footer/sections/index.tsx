import type { FC } from "react";
import type { ILinkSection } from "@shared-ui/interfaces/menus/footer";
import { Link } from "@shared-ui/components/link";
import { FooterSectionsStyle } from "./style";

export const LinkSections: FC<ILinkSection> = ({
  links,
  linkComponent
}) => {
  const {
    wrapperLinksServices,
    containerLinksServices,
    titleLinkService,
    linkStyle,
    wrapperLink
  } = FooterSectionsStyle();

  return (
    <div className={wrapperLinksServices()}>
      {links?.map(({ title, link }, idx) => (
        <section key={idx} className={containerLinksServices()}>
          <span className={titleLinkService()}>{title}</span>
          <ul>
            {link?.map((link, idx) => (
              <li key={idx} className={wrapperLink()}>
                <Link
                  {...link}
                  component={linkComponent}
                  href={link?.href ?? ""}
                  className={{ base: linkStyle() }}
                >
                  {link?.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};
