import React from "react";
import { render, screen } from "@testing-library/react";
import { ClientModal } from "@components/client/ClientModal";
import { ModalContext } from "@context/modal";

const ModalMock = jest.fn(({ children }: any) => (
  <div data-testid="modal">{children}</div>
));

jest.mock("@sitio-publico/shared-ui", () => ({
  Modal: (props: any) => ModalMock(props)
}));

jest.mock("src/helpers/modal", () => {
  const { RenderModalType } = jest.requireActual("@lib/constants/state");
  return {
    MODAL_TYPE: {
      [RenderModalType.CONTACT_FORM]: () => <div data-testid="modal-content" />
    }
  };
});

describe("ClientModal", () => {
  it("renders modal content when type is set", () => {
    const { RenderModalType } = jest.requireActual("@lib/constants/state");
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{
          state: true,
          handlerState: jest.fn(),
          type: RenderModalType.CONTACT_FORM
        }}
      >
        {children}
      </ModalContext.Provider>
    );

    render(<ClientModal />, { wrapper });

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-content")).toBeInTheDocument();
  });

  it("renders empty modal when type is missing and handles close", () => {
    const handlerState = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{
          state: true,
          handlerState,
          type: undefined
        }}
      >
        {children}
      </ModalContext.Provider>
    );

    ModalMock.mockClear();
    render(<ClientModal />, { wrapper });

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.queryByTestId("modal-content")).toBeNull();

    const onClose = ModalMock.mock.calls[0][0].onClose;
    onClose();
    expect(handlerState).toHaveBeenCalledWith(false);
  });
});
