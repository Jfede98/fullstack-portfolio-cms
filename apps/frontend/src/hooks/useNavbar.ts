import { type MouseEvent } from "react";
import { useGtm } from "./useGtm";
import { INavbarProps } from "@sitio-publico/shared-ui";
import { useCustomPathname } from "./useCustomPathname";
import type { ILeadFormSelection } from "@interfaces/coverageForm";
import { useLeadButtonAction } from "./useLeadButtonAction";

type HookProps = Pick<INavbarProps, "buttonContact">;
type TButtonWithLeadSelection = NonNullable<HookProps["buttonContact"]> & {
  leadFormSelection?: ILeadFormSelection;
};

export const useNavbar = ({ buttonContact }: HookProps) => {
  const { addEvent } = useGtm();
  const pathname = useCustomPathname();
  const { runLeadButtonAction } = useLeadButtonAction();

  const handlerContactButton = (e: MouseEvent<HTMLButtonElement>) => {
    const section = "menu";
    const mappedButton = buttonContact as TButtonWithLeadSelection | undefined;

    if (mappedButton?.identifier === 0) {
      e.preventDefault();
    }

    void runLeadButtonAction({
      button: mappedButton,
      section,
      onModal: () =>
        addEvent({
          event: "open_form",
          section,
          flow: pathname,
          elementDescription: "contratar"
        }),
      onWhatsapp: () => {
        buttonContact?.onClick?.(e);
        addEvent({
          event: "working_lead",
          section,
          flow: pathname,
          elementDescription: "solicitar por whatsapp"
        });
      },
      onSimple: () => {
        buttonContact?.onClick?.(e);
      }
    });
  };

  return { handlerContactButton };
};
