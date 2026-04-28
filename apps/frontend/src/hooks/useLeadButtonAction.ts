import { FormContactContext } from "@context/formContact";
import { ModalContext } from "@context/modal";
import { RenderModalType } from "@lib/constants/state";
import type { ILeadFormSelection } from "@interfaces/coverageForm";
import { useContext } from "react";
import {
  hasRenderableInputs,
  resolveLeadSelection
} from "@lib/helpers/leadSelection";

type TButtonIdentifier = 0 | 1 | 2 | 3 | 4;

type TLeadButton = {
  identifier?: number;
  leadFormSelection?: ILeadFormSelection;
};

type TLeadButtonActionParams = {
  button?: TLeadButton;
  section: string;
  onModal?: () => void;
  onWhatsapp?: () => void;
  onSimple?: () => void;
  onSemiautomaticFlow?: () => void;
  onLead?: () => void;
};

const MODAL_IDENTIFIER: TButtonIdentifier = 0;
const WHATSAPP_IDENTIFIER: TButtonIdentifier = 1;
const SEMIAUTOMATICFLOW_IDENTIFIER: TButtonIdentifier = 3;
const LEAD_IDENTIFIER: TButtonIdentifier = 4;

export const useLeadButtonAction = () => {
  const { handlerState, handlerModalType } = useContext(ModalContext);
  const { setSection, handlerData, setLeadSelection, submitForm } = useContext(FormContactContext);

  const runLeadButtonAction = async ({
    button,
    section,
    onModal,
    onWhatsapp,
    onSimple,
    onSemiautomaticFlow,
    onLead,
  }: TLeadButtonActionParams): Promise<void> => {
    const identifier = button?.identifier;

    if (identifier === WHATSAPP_IDENTIFIER) {
      onWhatsapp?.();
      return;
    }

    if (identifier === SEMIAUTOMATICFLOW_IDENTIFIER) {
      onSemiautomaticFlow?.();
      return;
    }

    if (identifier === LEAD_IDENTIFIER) {
      setLeadSelection?.(undefined);
      onLead?.();
      await submitForm?.();
      return;
    }

    if (identifier === MODAL_IDENTIFIER) {
      const resolvedSelection = await resolveLeadSelection(
        button?.leadFormSelection
      );
      const leadForm = resolvedSelection?.form;
      if (!leadForm || !hasRenderableInputs(resolvedSelection)) {
        console.error(
          "[lead-button] Configuracion invalida: button modal sin formulario completo (inputs)",
          {
            section,
            identifier,
            leadFormDocumentId: resolvedSelection?.leadFormDocumentId,
          }
        );
        return;
      }

      handlerData?.(leadForm);
      setLeadSelection?.(resolvedSelection);
      setSection?.(section);
      handlerModalType?.(RenderModalType.CONTACT_FORM);
      handlerState(true);
      onModal?.();
      return;
    }

    onSimple?.();
  };

  return {
    runLeadButtonAction,
  };
};
