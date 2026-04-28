import { type FC } from "react";
import { type ITypographyProps } from "@shared-ui/interfaces/typography";
import clsx from "clsx";
import { TypographyStyle } from "./style";

export const Typography: FC<ITypographyProps> = ({
  className,
  small = false,
  underline = false,
  preserveLineBreaks = false,
  unstyled = false,
  tag = "span",
  children,
  dataTestid,
  ...props
}) => {
  const Tag = tag;
  const styles = unstyled ? undefined : TypographyStyle({ ...props, small, underline });

  return (
    <Tag
      data-testid={dataTestid}
      className={clsx(styles, className?.base, preserveLineBreaks && "whitespace-pre-line")}
    >
      {children}
    </Tag>
  );
};
