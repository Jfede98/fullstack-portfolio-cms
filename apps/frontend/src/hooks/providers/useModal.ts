import type { IModalContext } from "@interfaces/context/modal";
import type { RenderModalType } from "@lib/constants/state";
import { useCallback, useLayoutEffect, useState } from "react";

export const useModal = (): IModalContext => {
  const [state, setState] = useState(false);
  const [type, setType] = useState<IModalContext["type"]>();
  const [modalData, setModalData] = useState<any>(null);

  const handlerReset = useCallback(() => {
    if (state) return;
    setType(undefined);
    setModalData(null);
  }, [state]);

  const handlerState = useCallback((s: boolean) => setState(s), []);

  const handlerModalType = useCallback((t: RenderModalType) => setType(t), []);

  const handlerModalData = useCallback((data: any) => setModalData(data), []);

  useLayoutEffect(() => {
    handlerReset();
  }, [handlerReset]);

  return {
    state,
    type,
    modalData,
    handlerState,
    handlerModalType,
    handlerModalData,
    handlerReset
  };
};
