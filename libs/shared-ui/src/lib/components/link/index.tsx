import { type FC } from "react";
import { type ILink } from "@shared-ui/interfaces/link";

export const Link: FC<ILink> = ({
  component: Component = "a",
  children,
  className,
  onClick,
  ...props
}) => (
  <div onClick={onClick} className={className?.wrapper}>
    <Component className={className?.base} {...props} aria-label={props?.ariaLabel ?? "enlace"}>
      {children}
    </Component>
  </div>
);
