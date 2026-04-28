import { NavbarStyle } from "./style";
import { useState, type FC } from "react";
import type { INavbarProps } from "@shared-ui/interfaces/menus/navbar";
import { Logo } from "@shared-ui/components/logo";
import { Button } from "@shared-ui/components/button";
import { Link } from "@shared-ui/components/link";
import { HamburguerNavbar } from "./hamburguer";
import { SidebarDrawer } from "./sidebar";
import { DropdownSidebarNavbar } from "./dropdownSidebar";
import { TopNavbarTab } from "./topNavbarTab";
import { ItemsNavbar } from "./itemsNavbar";
import { SessionLink } from "./sessionButton";

export const Navbar: FC<INavbarProps> = ({
  logo,
  linkComponent,
  links,
  sessionLink,
  buttonContact,
  navbarTop,
  navbarVariant = "default"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    base,
    logoStyle,
    wrapperButtons,
    button,
    mainNavContainer,
    simpleHeader,
    simpleContainer,
    sessionWrapper,
    mobileWrapper,
  } = NavbarStyle();

  if (navbarVariant === "none") {
    return null;
  }

  if (navbarVariant === "simple") {
    return (
      <header className={simpleHeader()}>
        <div className={simpleContainer()}>
          <Link href="/">
            {logo?.src ? (
              <img {...logo} alt={logo?.alt ?? "logo"} className={logoStyle()} />
            ) : (
              <Logo className={{ base: logoStyle() }} />
            )}
          </Link>
        </div>
      </header>
    );
  }

  if (navbarVariant === "no_items") {
    return (
      <div className={base()} data-state="closed">
        <nav className={mainNavContainer()} role="navigation">
          <Link href="/">
            {logo?.src ? (
              <img {...logo} alt={logo?.alt ?? "logo"} />
            ) : (
              <Logo className={{ base: logoStyle() }} />
            )}
          </Link>
        </nav>
      </div>
    );
  }

  return (
    <>
      <div className={base()} data-state={isOpen ? "open" : "closed"}>
        {navbarTop && <TopNavbarTab links={navbarTop} />}
        <nav className={mainNavContainer()} role="navigation">
          <Link href="/">
            {logo?.src ? (
              <img {...logo} alt={logo?.alt ?? "logo"} />
            ) : (
              <Logo className={{ base: logoStyle() }} />
            )}
          </Link>

          <div className={wrapperButtons()}>
            <ItemsNavbar linkComponent={linkComponent} links={links} />
            <Button {...buttonContact} className={{ base: button() }} />

            {sessionLink?.href && (
              <div className={sessionWrapper()}>
                <SessionLink {...sessionLink} />
              </div>
            )}

            <HamburguerNavbar
              isOpen={isOpen}
              onClose={() => setIsOpen(!isOpen)}
            />
          </div>
        </nav>
      </div>

      <div className={mobileWrapper()}>
        <SidebarDrawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <DropdownSidebarNavbar
            linkComponent={linkComponent}
            links={links}
            sessionLink={sessionLink}
            topNavbar={navbarTop}
          />
        </SidebarDrawer>
      </div>
    </>
  );
};
