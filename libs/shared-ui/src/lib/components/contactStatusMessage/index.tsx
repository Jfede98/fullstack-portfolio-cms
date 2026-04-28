"use client";

import type { FC } from "react";
import clsx from "clsx";
import { Button } from "@shared-ui/components/button";
import { Icon } from "@shared-ui/components/icons";
import type {
  IContactStatusMessageProps
} from "@shared-ui/interfaces/contactStatusMessage";
import { ContactStatusMessageStyle } from "./style";

const SuccessIcon = () => (
  <svg
    viewBox="0 0 16 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="h-5 w-6"
  >
    <path
      d="M1.5 6.5L6 11L14.5 1.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ContactStatusMessage: FC<IContactStatusMessageProps> = ({
  status,
  title: titleText,
  description: descriptionText,
  buttonLabel,
  onAction,
  className
}) => {
  const { wrapper, icon, title, description, button } =
    ContactStatusMessageStyle();
  const isSuccess = status === "success";

  return (
    <div className={clsx(wrapper(), className?.wrapper)}>
      <div
        className={clsx(
          icon(),
          isSuccess ? "bg-primary-900 text-white" : "text-orange-900",
        className?.icon
      )}
    >
        {isSuccess && <SuccessIcon />}
        {!isSuccess && (
          <Icon name="warning_amber" type="outlined" size="lg" />
        )}
      </div>
      <div>
        <div className={clsx(title(), className?.title)}>{titleText}</div>
        <div className={clsx(description(), className?.description)}>
          {descriptionText}
        </div>
      </div>
      <Button className={{ base: clsx(button(), className?.button) }} color="primary" onClick={onAction}>
        {buttonLabel}
      </Button>
    </div>
  );
};
