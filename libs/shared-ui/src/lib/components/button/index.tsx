import { ButtonStyle } from "./style";
import clsx from "clsx";
import { colorLoaderVariant, createRipple } from "@shared-ui/helpers/button";
import { Icon } from "@shared-ui/components/icons";

import type {
  IButtonProps,
  ButtonClickEvent
} from "@shared-ui/interfaces/button";
import { type FC, type ElementType, useEffect, useState } from "react";

export const Button: FC<IButtonProps> = (props) => {
  const [iconLoadFailed, setIconLoadFailed] = useState(false);

  const safeProps = {
    ...(props as IButtonProps & { leadFormSelection?: unknown }),
  };
  if ("leadFormSelection" in safeProps) {
    delete (safeProps as { leadFormSelection?: unknown }).leadFormSelection;
  }

  const {
    loading = false,
    disabledRippleEffect = false,
    type = "button",
    color = "primary",
    typeStyle = "square",
    size,
    fontStyle,
    disabled,
    children,
    className,
    href,
    target,
    icon,
    ...nativeProps
  } = safeProps;
  const shouldUseAssetIcon = icon === "WhatsappVector";

  const isDisabled = disabled || loading;
  const isLink = type === "link";
  const Tag: ElementType = isLink ? "a" : "button";

  const tagProps = isLink
    ? {
        href,
        target,
        rel: target === "_blank" ? "noopener noreferrer" : undefined,
        role: "button"
      }
    : { type: type as "button" | "submit" | "reset" };

  const buttonStyle = ButtonStyle({
    color,
    size,
    disabled,
    fontStyle,
    typeStyle
  });

  useEffect(() => {
    setIconLoadFailed(false);
  }, [icon]);

  return (
    <Tag
      {...tagProps}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(nativeProps as any)}
      type={!isLink ? type : undefined}
      disabled={!isLink ? isDisabled : undefined}
      aria-busy={loading}
      aria-disabled={isLink && isDisabled ? true : undefined}
      tabIndex={isLink && isDisabled ? -1 : undefined}
      className={clsx(buttonStyle, className?.base)}
      onClick={(e: ButtonClickEvent) => {
        props?.onClick?.(
          e as React.MouseEvent<HTMLButtonElement & HTMLAnchorElement>
        );
        if (!disabledRippleEffect) createRipple(e, isDisabled);
      }}
    >
      {loading && (
        <span
          className={clsx(
            "loader",
            colorLoaderVariant[color],
            className?.loading
          )}
          aria-hidden="true"
        />
      )}
      <span className="relative z-10">{children}</span>
      {icon && shouldUseAssetIcon && !iconLoadFailed && (
        <img
          src={`/assets/svg/${icon}.svg`}
          alt={`btn-${icon}`}
          height={20}
          width={20}
          className="inline-block text-primary-500"
          onError={() => setIconLoadFailed(true)}
        />
      )}
      {icon && (!shouldUseAssetIcon || iconLoadFailed) && (
        <Icon
          name={icon}
          type="outlined"
          size="msm"
          className={{ base: "inline-flex !text-[20px] leading-none" }}
        />
      )}
    </Tag>
  );
};
