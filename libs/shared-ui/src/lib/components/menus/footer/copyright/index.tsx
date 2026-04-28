import { Link } from "@shared-ui/components/link";
import type { ICopyright } from "@shared-ui/interfaces/menus/footer";

import { FooterCopyrightStyle } from "./styles";
import type { FC } from "react";

export const Copyright: FC<ICopyright> = ({
  linkComponent,
  ...linkPolicies
}) => {
  const { container, textStyle, linkStyle } = FooterCopyrightStyle();

  const policiesProps = { ...linkPolicies };
  delete policiesProps.label;

  return (
    <article className={container()}>
      <span className={textStyle()}>
        © Xtrim {new Date().getFullYear()} -{" "}
        <span className="uppercase">
          servicios de telecomunicaciones setel s.a.
        </span>
      </span>
      {policiesProps && (
        <Link
          {...policiesProps}
          href={policiesProps.href ?? ""}
          className={{ base: linkStyle() }}
          component={linkComponent}
        >
          {linkPolicies?.label ?? ""}
        </Link>
      )}
    </article>
  );
};
