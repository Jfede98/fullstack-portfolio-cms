"use client";

import { type FC } from "react";
import { type INavbarProps, Navbar } from "@sitio-publico/shared-ui";
import Link from "next/link";
import { useNavbar } from "@hooks/useNavbar";

export const ClientNavbar: FC<INavbarProps> = (props) => {
  const { handlerContactButton } = useNavbar(props);
  const buttonContact = props.buttonContact
    ? {
        ...(props.buttonContact as INavbarProps["buttonContact"] & {
          leadFormSelection?: unknown;
        }),
      }
    : undefined;
  if (buttonContact && "leadFormSelection" in buttonContact) {
    delete (buttonContact as { leadFormSelection?: unknown }).leadFormSelection;
  }

  return (
    <Navbar
      {...props}
      linkComponent={Link}
      buttonContact={{
        ...buttonContact,
        onClick: handlerContactButton
      }}
    />
  );
};
