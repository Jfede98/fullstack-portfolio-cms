import { render, screen, fireEvent } from "@testing-library/react";
import { ContactStatusMessage } from "@components/forms/contact/statusMessage";
import { FormContactContext } from "@context/formContact";
import { ModalContext } from "@context/modal";

const ButtonMock = jest.fn(({ children, onClick }: any) => (
  <button onClick={onClick}>{children}</button>
));
const IconMock: any = jest.fn(() => <div data-testid="warning-icon" />);

jest.mock("@sitio-publico/shared-ui", () => ({
  Button: (props: any) => ButtonMock(props),
  Icon: (props: any) => IconMock(props)
}));

describe("ContactStatusMessage", () => {
  it("returns null when statusType is missing", () => {
    const { container } = render(
      <ModalContext.Provider value={{ state: true, handlerState: jest.fn() }}>
        <FormContactContext.Provider value={{ statusType: null } as any}>
          <ContactStatusMessage />
        </FormContactContext.Provider>
      </ModalContext.Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it("returns null when no message matches the status", () => {
    const { container } = render(
      <ModalContext.Provider value={{ state: true, handlerState: jest.fn() }}>
        <FormContactContext.Provider
          value={
            {
              statusType: "success",
              data: { statusMessage: [{ type: "error", title: "Err" }] }
            } as any
          }
        >
          <ContactStatusMessage />
        </FormContactContext.Provider>
      </ModalContext.Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders the error status message and closes modal on button click", () => {
    const handlerState = jest.fn();

    render(
      <ModalContext.Provider value={{ state: true, handlerState }}>
        <FormContactContext.Provider
          value={
            {
              statusType: "error",
              data: {
                statusMessage: [
                  {
                    title: "Ups",
                    description: "Fallo",
                    buttonLabel: "Reintentar",
                    type: "error"
                  }
                ]
              }
            } as any
          }
        >
          <ContactStatusMessage />
        </FormContactContext.Provider>
      </ModalContext.Provider>
    );

    expect(screen.getByText("Ups")).toBeInTheDocument();
    expect(screen.getByText("Fallo")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Reintentar"));
    expect(handlerState).toHaveBeenCalledWith(false);
  });

  it("renders the success status message", () => {
    render(
      <ModalContext.Provider value={{ state: true, handlerState: jest.fn() }}>
        <FormContactContext.Provider
          value={
            {
              statusType: "success",
              data: {
                statusMessage: [
                  {
                    title: "Listo",
                    description: "Ok",
                    buttonLabel: "Cerrar",
                    type: "success"
                  }
                ]
              }
            } as any
          }
        >
          <ContactStatusMessage />
        </FormContactContext.Provider>
      </ModalContext.Provider>
    );

    expect(screen.getByText("Listo")).toBeInTheDocument();
    expect(screen.getByText("Ok")).toBeInTheDocument();
    expect(screen.getByText("Cerrar")).toBeInTheDocument();
  });
});
