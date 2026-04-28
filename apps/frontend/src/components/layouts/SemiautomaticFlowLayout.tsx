import { ClientNavbar } from "@components/client/ClientNavbar";
import { ClientFooter } from "@components/client/ClientFooter";
import { SemiautomaticFlowMain } from "@components/layouts/SemiautomaticFlowMain";
import { getRootMenu } from "@lib/helpers/menu";
import { getSemiautomaticFlow } from "@lib/api/web/flow.ts";
import type { ReactNode } from "react";
import type { IFooterProps, INavbarProps } from "@sitio-publico/shared-ui";

export const SemiautomaticFlowLayout = async ({ children }: { children: ReactNode }) => {
  const [menuResult, flow] = await Promise.all([
    getRootMenu().catch(() => undefined),
    getSemiautomaticFlow().catch(() => undefined)
  ]);
  const [navbar, footer] = menuResult ?? [{} as INavbarProps, {} as IFooterProps];
  const navbarVariant = flow?.navbarVariant ?? "no_items";

  const mainOffsetByVariant: Record<string, string> = {
    none: "pt-0",
    simple: "pt-16",
    no_items: "pt-0",
    default: "pt-16"
  };

  const mainOffsetClass = mainOffsetByVariant[navbarVariant] ?? "pt-20";

  return (
    <>
      <ClientNavbar
        {...navbar}
        navbarVariant={navbarVariant}
      />
      <SemiautomaticFlowMain navbarVariant={navbarVariant} className={mainOffsetClass}>
        {children}
      </SemiautomaticFlowMain>
      <ClientFooter
        {...footer}
        footerVariant={flow?.footerVariant ?? "no_items"}
      />
    </>
  );
};
