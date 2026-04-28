export type ContactStatusMessageType = "success" | "error" | "duplicated";

export type IContactStatusMessageClassName = {
  wrapper?: string;
  icon?: string;
  title?: string;
  description?: string;
  button?: string;
};

export interface IContactStatusMessageProps {
  status: ContactStatusMessageType;
  title: string;
  description: string;
  buttonLabel: string;
  onAction?: () => void;
  className?: IContactStatusMessageClassName;
}
