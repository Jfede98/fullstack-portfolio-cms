import { render, screen, fireEvent } from "@testing-library/react";
import { Consumer, ModalContext, Provider } from "@context/modal";
import { useContext } from "react";

const ContextReader = () => {
  const { state, handlerState } = useContext(ModalContext);
  return (
    <>
      <div data-testid="modal-state">{String(state)}</div>
      <button onClick={() => handlerState(true)}>Open</button>
    </>
  );
};

describe("ModalContext", () => {
  it("provides default values when no provider is used", () => {
    render(<ContextReader />);

    expect(screen.getByTestId("modal-state").textContent).toBe("false");
    fireEvent.click(screen.getByText("Open"));
  });

  it("uses provider values and handler", () => {
    const handlerState = jest.fn();
    render(
      <ModalContext.Provider value={{ state: true, handlerState }}>
        <ContextReader />
      </ModalContext.Provider>
    );

    expect(screen.getByTestId("modal-state").textContent).toBe("true");
    fireEvent.click(screen.getByText("Open"));
    expect(handlerState).toHaveBeenCalledWith(true);
  });

  it("exports Provider and Consumer aliases", () => {
    expect(Provider).toBeDefined();
    expect(Consumer).toBeDefined();
  });

  it("default internal no-op functions do not throw", () => {
    const { result } = require("@testing-library/react").renderHook(() => useContext(ModalContext));
    expect(() => result.current.handlerState(true)).not.toThrow();
    expect(() => result.current.handlerModalData(null)).not.toThrow();
  });
});
