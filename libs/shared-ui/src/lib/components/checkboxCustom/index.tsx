import { type FC, useId } from "react";
import Markdown from "react-markdown";
import clsx from "clsx";
import type { ICheckboxCustomProps } from "@shared-ui/interfaces/checkboxCustom";
import { CheckboxCustomStyle } from "./style";

export const CheckboxCustom: FC<ICheckboxCustomProps> = ({
  label,
  name,
  required = false,
  errorMessage,
  className,
  variant = "default",
  ...inputProps
}) => {
  const generatedId = useId();
  const id = inputProps.id ?? generatedId;
  const hasError = Boolean(errorMessage);
  const { base, checkboxWrapper, checkbox, icon, labelText, link, errorMessage: errorText } =
    CheckboxCustomStyle({ disabled: inputProps.disabled, hasError, variant });

  return (
    <>
      <label htmlFor={id} className={clsx(base(), className?.base)}>
        <span className={clsx(checkboxWrapper(), className?.checkboxWrapper)}>
          <input
            {...inputProps}
            id={id}
            name={name}
            type="checkbox"
            required={required}
            className={clsx(checkbox(), className?.checkbox)}
          />
          <span className={clsx(icon(), className?.icon)}>
            <svg
              viewBox="0 0 10 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M1 4.5L3.5 7L9 1"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </span>
        <span className={clsx(labelText(), className?.label)}>
          <Markdown
            components={{
              p: ({ children }) => <>{children}</>,
              a: ({ children, href }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(link(), className?.link)}
                >
                  {children}
                </a>
              )
            }}
          >
            {label}
          </Markdown>
        </span>
      </label>
      {errorMessage && (
        <span className={clsx(errorText(), className?.errorMessage)}>
          {errorMessage}
        </span>
      )}
    </>
  );
};
