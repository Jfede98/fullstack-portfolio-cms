import type { ILink } from "@shared-ui/interfaces/link";

type IWhatsAppClassName = {
  base?: string;
  img?: string;
  text?: string;
};

export interface IWhatsAppProps extends Omit<ILink, "className" | "children" | "href" | "target"> {
  className?: IWhatsAppClassName;
  phoneNumber: string;
  text: string;
}
