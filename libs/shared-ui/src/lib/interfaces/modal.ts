import type { ReactNode } from "react";

type ModalClassName = {
  overlay?: string;
  base?: string;
  body?: string;
}

export interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  className?: ModalClassName;
}
