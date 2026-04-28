import type { StrapiGlobal } from "@interfaces/components/whatsapp";
import type { IWhatsAppProps } from "@sitio-publico/shared-ui";

export const mapWhatsApp = (
  data?: StrapiGlobal | null
): Pick<IWhatsAppProps, "phoneNumber" | "text"> | undefined => {
  const whatsapp = data?.whatsAppFloating;
  if (!whatsapp?.phoneNumber || !whatsapp?.text) return undefined;

  return {
    phoneNumber: whatsapp.phoneNumber,
    text: whatsapp.text
  };
};
