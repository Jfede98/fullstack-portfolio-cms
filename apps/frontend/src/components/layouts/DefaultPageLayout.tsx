import { ClientNavbar } from "@components/client/ClientNavbar";
import { ClientFooter } from "@components/client/ClientFooter";
import { getRootMenu } from "@lib/helpers/menu";
import type { TMenuVariant } from "@interfaces/lib/pages";
import type { ReactNode } from "react";

type DefaultPageLayoutProps = {
  children: ReactNode;
  navbarVariant?: TMenuVariant;
  footerVariant?: TMenuVariant;
};

export const DefaultPageLayout = async ({
  children,
  navbarVariant = "default",
  footerVariant = "default"
}: DefaultPageLayoutProps) => {
  const [[navbar, footer]] = await Promise.all([getRootMenu()]);
  return (
    <>
      <ClientNavbar {...navbar} navbarVariant={navbarVariant} />
      <main role="main">{children}</main>
      <ClientFooter {...footer} footerVariant={footerVariant} />
    </>
  );
};
