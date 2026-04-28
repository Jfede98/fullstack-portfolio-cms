"use client";

import { type FC } from "react";
import { Footer, type IFooterProps } from "@sitio-publico/shared-ui";
import Link from "next/link";

export const ClientFooter: FC<IFooterProps> = (props) => {
  return <Footer {...props} linkComponent={Link} />;
};
