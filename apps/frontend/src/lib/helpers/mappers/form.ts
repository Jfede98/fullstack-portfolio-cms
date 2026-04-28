import { mapIcon } from "./icon";
import { mapInput } from "./input";
import type { IIconProps } from "@sitio-publico/shared-ui";
import { StrapiForm } from "@interfaces/lib/strapi/strapi";
import { ICoverageFormProps } from "@interfaces/coverageForm";

const normalizeButtonColor = (
  variant?: string
): NonNullable<ICoverageFormProps["button"]>["color"] => {
  if (variant === "secondary" || variant === "tertiary") return variant;
  return "primary";
};

const FORM_BUTTON_IDENTIFIER_MAP: Record<string, number> = {
  modal: 0,
  whatsapp: 1,
  simple: 2,
  "semiautomatic-flow": 3,
  lead: 4,
  coverage: 5
};

const mapFormButton = (
  button?: StrapiForm["button"]
): ICoverageFormProps["button"] => {
  if (!button?.label) return undefined;
  const hasHref = Boolean(button.href);
  const resolvedType =
    hasHref && (button.isExternalHref || !button.type || button.type === "link")
      ? "link"
      : button.type;

  return {
    children: button.label,
    href: button.href ?? undefined,
    type: resolvedType ?? undefined,
    target: button.isExternalHref ? "_blank" : undefined,
    isExternalHref: button.isExternalHref ? undefined : false,
    color: normalizeButtonColor(button.variant),
    hasIcon: button.hasIcon ?? false,
    identifier: button.identifier
      ? (FORM_BUTTON_IDENTIFIER_MAP[button.identifier] ?? 2)
      : undefined
  };
};

export const mapperForm = (data: StrapiForm): ICoverageFormProps => ({
  title: data?.title ?? "",
  description: data?.description ?? "",
  icon: mapIcon(data?.icon) as IIconProps,
  inputs: data?.inputs
    ?.map((input) => {
      const mapped = mapInput(input);
      if (!mapped || !input.name) return undefined;
      return { ...mapped, name: input.name } as ICoverageFormProps["inputs"][number];
    })
    .filter(Boolean) as ICoverageFormProps["inputs"],
  button: mapFormButton(data?.button),
  privacyCheckbox:
    data?.privacyCheckbox?.label && data?.privacyCheckbox?.name
      ? {
          label: data.privacyCheckbox.label,
          name: data.privacyCheckbox.name,
          required: data.privacyCheckbox.required ?? true
        }
      : undefined,
  statusMessage: data?.statusMessage
    ?.filter(
      (item) =>
        item?.title &&
        item?.description &&
        item?.buttonLabel &&
        item?.type
    )
    .map((item) => ({
      title: item.title!,
      description: item.description!,
      buttonLabel: item.buttonLabel!,
      type: item.type!
    })),
  showBorderLine: data?.showBorderLine ?? true,
  isBlock: true
});
