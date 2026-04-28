"use client";

import { Button, Icon } from "@sitio-publico/shared-ui";
import { ModalContext } from "@context/modal";
import { FormContactContext } from "@context/formContact";
import { useContext } from "react";
import clsx from "clsx";
import { CoverageFormStyle } from "./style";

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

export const ContactStatusMessage = () => {
  const { data, statusType, onSuccessAction } = useContext(FormContactContext);
  const { handlerState } = useContext(ModalContext);
  const { statusWrapper, statusIcon, statusTitle, statusDescription, statusButton } =
    CoverageFormStyle();

  if (!statusType) return null;
  const message = data?.statusMessage?.find((item) => item.type === statusType);
  if (!message) return null;

  const handleButtonClick = () => {
    handlerState(false);
    if (statusType === "success") {
      onSuccessAction?.();
    }
  };

  return (
    <div className={statusWrapper()}>
      <div
        className={clsx(
          statusIcon(),
          statusType === "success"
            ? "bg-primary-900 text-white"
            : "text-orange-900"
        )}
      >
        {statusType === "success" && <SuccessIcon />}
        {statusType !== "success" && (
          <Icon name="warning_amber" type="outlined" size="lg" />
        )}
      </div>
      <div>
        <div className={statusTitle()}>{message.title}</div>
        <div className={statusDescription()}>{message.description}</div>
      </div>
      <Button
        className={{ base: statusButton() }}
        color="primary"
        onClick={handleButtonClick}
      >
        {message.buttonLabel}
      </Button>
    </div>
  );
};
