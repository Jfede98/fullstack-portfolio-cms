"use server";

import { getGlobal } from "@lib/api/web/global";
import { mapWhatsApp } from "@lib/helpers/mappers/whatsapp";
import { ClientWhatsApp } from "@components/client/ClientWhatsApp";

export const WhatsApp = async () => {
  const global = await getGlobal();
  const whatsAppProps = mapWhatsApp(global);

  if (!whatsAppProps) return null;

  return <ClientWhatsApp {...whatsAppProps} />;
};
