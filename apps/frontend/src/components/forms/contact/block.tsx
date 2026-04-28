"use client";

import { IContactFormBlockProps } from "@interfaces/coverageForm";
import { ContactForm } from "@components/forms/contact";
import { type FC } from "react";
import { useContactFormBlock } from "@hooks/client/useContactFormBlock";

export const FormBlock: FC<IContactFormBlockProps> = (props) => {
  const { contactProps } = useContactFormBlock(props);

  const hasColumnLayout = contactProps.inputs?.some(
    input => input.column && input.column !== "default"
  );

const shouldPreserveVariant =
  contactProps.variant === "semiautomatic-flow" ||
  contactProps.variant === "semiautomatic-error" ||
  contactProps.variant === "semiautomatic-data";

  const formProps = {
    ...contactProps,
    variant:
      contactProps.variant === "dsa"
        ? "dsa"
        : shouldPreserveVariant
          ? contactProps.variant
          : hasColumnLayout
            ? "columnLayout"
            : contactProps.variant
  } as any; //TODO: corregir este any

  return <ContactForm {...formProps} isBlock />;
};
