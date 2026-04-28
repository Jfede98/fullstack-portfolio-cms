import type {
  IComparativeTableProps,
  IComparativeParameter,
  IComparativeSection,
  IComparativePlan
} from "@interfaces/components/comparativeTable";
import type {
  StrapiComparativeTable,
  StrapiComparativeParameter,
  StrapiComparativeSection,
  StrapiComparativeActiveStatus,
  StrapiButton
} from "@interfaces/lib/strapi/strapi";
import { mapTypography } from "./utils";
import { mapButton } from "./button";
import type { IButtonProps } from "@sitio-publico/shared-ui";

const mapButtonIdentifier = (identifier?: string): number => {
  const identifierMap: Record<string, number> = {
    modal: 0,
    whatsapp: 1,
    simple: 2,
    "semiautomatic-flow": 3,
    lead: 4
  };

  return identifier ? (identifierMap[identifier] ?? 0) : 0;
};

const mapComparativeParameter = (
  item: StrapiComparativeParameter
): IComparativeParameter | null => {
  if (!item.label && !item.description) return null;

  return {
    label: item.label ?? undefined,
    description: item.description ?? undefined
  };
};

const mapActiveStatus = (
  activeStatus?: StrapiComparativeActiveStatus[]
): boolean[] => {
  if (!activeStatus || !Array.isArray(activeStatus)) return [];
  return activeStatus.map((item) => item.isActive ?? false);
};

const mapPlan = (
  price?: string,
  prevPrice?: string,
  buttons?: StrapiButton[]
): IComparativePlan => {
  const mappedButtons: IButtonProps[] = [];

  if (buttons) {
    for (const button of buttons) {
      const baseButton = mapButton(button);
      if (baseButton) {
        mappedButtons.push({
          ...baseButton,
          identifier: mapButtonIdentifier(button.identifier)
        } as IButtonProps);
      }
    }
  }

  return {
    price: price ? parseFloat(price) : undefined,
    prevPrice: prevPrice ? parseFloat(prevPrice) : undefined,
    buttons: (mappedButtons.length > 0 ? mappedButtons : undefined) as IButtonProps[] | undefined
  };
};

const mapSection = (
  item: StrapiComparativeSection
): IComparativeSection | null => {
  if (!item.label) return null;

  const plan = mapPlan(item.price, item.prevPrice, item.buttons);
  const active = mapActiveStatus(item.activeStatus);

  return {
    label: item.label,
    plan,
    active
  };
};

export const mapComparativeTable = (
  data: StrapiComparativeTable
): IComparativeTableProps => {
  const comparative = (data?.comparative?.map(mapComparativeParameter).filter(Boolean) ??
    []) as IComparativeParameter[];

  const sections = (data?.sections?.map(mapSection).filter(Boolean) ??
    []) as IComparativeSection[];

  return {
    title: data?.title ? mapTypography(data.title) : undefined,
    subtitle: data?.subtitle ? mapTypography(data.subtitle) : undefined,
    titleTable: data?.titleTable ? mapTypography(data.titleTable) : undefined,
    comparative: comparative.length > 0 ? comparative : undefined,
    sections: sections.length > 0 ? sections : undefined
  };
};
