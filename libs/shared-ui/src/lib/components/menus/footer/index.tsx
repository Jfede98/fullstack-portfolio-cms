import { type FC } from "react";
import { FooterStyle } from "./style";
import type { IFooterProps } from "@shared-ui/interfaces/menus/footer";
import { Logo } from "@shared-ui/components/logo";
import { Link } from "@shared-ui/components/link";
import { Copyright } from "./copyright";
import { LinkSections } from "./sections";
import { RegulatoriosButton } from "./regulatorios";
import { ItemsDesplegables } from "./itemsDesplegable";
import { SocialIcons } from "./socialIcons";
import { InfoFooter } from "./info";

export const Footer: FC<IFooterProps> = (args) => {
  const {
    socialNetworks,
    linkComponent,
    info,
    links,
    linkRegulatorios,
    linkPolicies,
    logo,
    footerVariant = "default"
  } = args;

  const {
    base,
    wrapperLogo,
    dividerStyle,
    wrapperSections,
    wrapperColumnsAndRegulatorios,
    wrapperRegulatorios,
    simpleBase,
    simpleContainer,
    noItemsBase,
  } = FooterStyle();

  if (footerVariant === "none") {
    return null;
  }

  if (footerVariant === "simple") {
    return (
      <footer className={simpleBase()}>
        <div className={simpleContainer()}>
          <Link href={logo?.link?.href ?? "/"}>
            {logo?.logo ? (
              <Logo {...logo.logo} />
            ) : (
              <Logo />
            )}
          </Link>
        </div>
      </footer>
    );
  }

  if (footerVariant === "no_items") {
    return (
      <footer className={noItemsBase()} role="contentinfo">
        <Copyright
          {...linkPolicies}
          linkComponent={linkComponent}
          href={linkPolicies?.href ?? ""}
        />
      </footer>
    );
  }

  return (
    <footer className={base()} role="contentinfo">
      <article className={wrapperSections()}>
        <section className={wrapperLogo()}>
          <Link {...logo?.link} href={logo?.link?.href ?? "/"}>
            <Logo {...logo?.logo} />
          </Link>

          <InfoFooter {...info} />
          <SocialIcons socialNetworks={socialNetworks} />
        </section>

        <div className={wrapperColumnsAndRegulatorios()}>
          <LinkSections links={links} linkComponent={linkComponent} />

          {linkRegulatorios && (
            <div className={wrapperRegulatorios()}>
              <RegulatoriosButton
                {...linkRegulatorios}
                href={linkRegulatorios?.href ?? ""}
                linkComponent={linkComponent}
                className="hidden xl:flex"
              />
            </div>
          )}
        </div>
      </article>
      <ItemsDesplegables linkComponent={linkComponent} links={links} />
      {linkRegulatorios && (
        <RegulatoriosButton
          {...linkRegulatorios}
          href={linkRegulatorios?.href ?? ""}
          linkComponent={linkComponent}
          className="xl:hidden"
        />
      )}
      <hr className={dividerStyle()} />
      <Copyright
        {...linkPolicies}
        linkComponent={linkComponent}
        href={linkPolicies?.href ?? ""}
      />
    </footer>
  );
};
