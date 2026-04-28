import type { TId } from "@interfaces/lib/strapi/modules";

export type TBlockCallToAction = TId & {
  label: string;
  href: string;
  type: string;
  variant: string;
  iconPosition: string;
  hasIcon: false;
  icon: string | null;
};
