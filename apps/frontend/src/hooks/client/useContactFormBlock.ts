import { FormContactContext } from "@context/formContact";
import type { IContactFormBlockProps } from "@interfaces/coverageForm";
import { resolveLeadSelection } from "@lib/helpers/leadSelection";
import { useContext, useEffect, useState } from "react";

const shouldPreserveVariant = (variant?: IContactFormBlockProps["variant"]) =>
  variant === "semiautomatic-flow" ||
  variant === "semiautomatic-error" ||
  variant === "semiautomatic-data";

export const useContactFormBlock = (props: IContactFormBlockProps) => {
  const { handlerData, setLeadSelection } = useContext(FormContactContext);
  const [contactProps, setContactProps] = useState<IContactFormBlockProps>(props);

  useEffect(() => {
    if (props == null) return;
    handlerData?.(props);

    let cancelled = false;
    void resolveLeadSelection(props.leadSelection).then((selection) => {
      if (cancelled) return;
      setLeadSelection?.(selection);
      if (selection?.form) {
        const preservedVariant = shouldPreserveVariant(props.variant)
          ? props.variant
          : selection.form.variant;

        const preservedShowBorderLine =
          props.showBorderLine ?? selection.form.showBorderLine;

        const preservedShowSelectedPlanInline =
          props.showSelectedPlanInline ?? selection.form.showSelectedPlanInline;

        const hydrated: IContactFormBlockProps = {
          ...props,
          ...selection.form,
          variant: preservedVariant,
          showBorderLine: preservedShowBorderLine,
          showSelectedPlanInline: preservedShowSelectedPlanInline,
          leadSelection: {
            ...selection,
            form: {
              ...selection.form,
              variant: preservedVariant,
              showBorderLine: preservedShowBorderLine,
              showSelectedPlanInline: preservedShowSelectedPlanInline
            }
          }
        };

        handlerData?.(hydrated);
        setContactProps(hydrated);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    contactProps
  };
};
