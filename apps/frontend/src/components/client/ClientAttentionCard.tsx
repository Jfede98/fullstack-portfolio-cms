"use client";

import type { FC } from "react";
import {
  type IAttentionCardProps,
  AttentionCard
} from "@sitio-publico/shared-ui";
import { useClientAttentionCard } from "@hooks/useClientAttentionCard";
import { TProvider } from "@interfaces/provider";
import Link from "next/link";

type Props = TProvider & { href: string; onClick?: () => void };
const LinkWrapperCard: FC<Props> = ({ children, onClick, href }) => (
  <Link href={href} target="_blank" onClick={onClick}>
    {children}
  </Link>
);

export const ClientAttentionCard: FC<IAttentionCardProps> = ({
  button,
  href,
  ...props
}) => {
  const { handlerCtaButton, isDesktop, gtmEvent } = useClientAttentionCard({
    title: props.title,
    href
  });

  const render = (
    <AttentionCard
      {...props}
      button={{ ...button, onClick: () => handlerCtaButton() }}
    />
  );

  return isDesktop ? (
    <LinkWrapperCard href={href ?? ""} onClick={gtmEvent}>
      {render}
    </LinkWrapperCard>
  ) : (
    render
  );
};
