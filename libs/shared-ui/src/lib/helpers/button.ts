import type { IButtonColorVariants } from "@shared-ui/interfaces/button";
import type { MouseEvent } from "react";

export const colorLoaderVariant: IButtonColorVariants = {
  primary: "bg-primary-50",
  secondary: "bg-primary",
  outline: "bg-primary",
  tertiary: "bg-white",
  noBorder: "bg-primary",
  whatsapp: "bg-white"
};

export const createRipple = (
  event: MouseEvent<HTMLElement>,
  isDisabled: boolean
) => {
  if (isDisabled) return;

  const button = event.currentTarget;
  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  const rect = button.getBoundingClientRect();

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.classList.add("ripple-span");

  const ripple = button.getElementsByClassName("ripple-span")[0];
  if (ripple) ripple.remove();

  button.appendChild(circle);
};