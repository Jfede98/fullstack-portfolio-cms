"use client";

import { WhatsApp, type IWhatsAppProps } from "@sitio-publico/shared-ui";
import { type FC } from "react";
import { WhatsAppStyle } from "./style";

export const ClientWhatsApp: FC<IWhatsAppProps> = (props) => {
  const styles = WhatsAppStyle();
  return <WhatsApp {...props} className={{ base: styles() }} />;
};
