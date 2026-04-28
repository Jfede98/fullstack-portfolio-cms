"use client";

import { Modal } from "@sitio-publico/shared-ui";
import { ModalContext } from "@context/modal";
import { useContext } from "react";
import { modalStyles } from "./style";
import { MODAL_TYPE } from "src/helpers/modal";

export const ClientModal = () => {
  const { state, handlerState, type } = useContext(ModalContext);
  const Component = type ? MODAL_TYPE[type] : null;

  return (
    <Modal
      size="md"
      isOpen={state}
      onClose={() => handlerState(false)}
      className={{ base: modalStyles() }}
    >
      {Component && <Component />}
    </Modal>
  );
};
