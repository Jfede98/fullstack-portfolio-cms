import { ContactForm } from "@components/forms/contact";
import { ContactStatusMessage } from "@components/forms/contact/statusMessage";
import { CenterServicesModal } from "@components/forms/CenterServicesModal";
import { ModalType } from "@interfaces/context/modal";

export const MODAL_TYPE: ModalType = {
  contactForm: ContactForm,
  contactFormStatus: ContactStatusMessage,
  centerServices: CenterServicesModal
} as const;
