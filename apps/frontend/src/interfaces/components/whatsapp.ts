import type { IWhatsAppProps } from "@sitio-publico/shared-ui";

export type StrapiWhatsAppFloating = Partial<
  Pick<IWhatsAppProps, "phoneNumber" | "text">
>;

export type StrapiGlobal = {
  whatsAppFloating?: StrapiWhatsAppFloating;
};
