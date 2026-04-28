import { render, screen } from "@testing-library/react";
import { Consumer, FormContactContext, Provider } from "@context/formContact";
import { useContext } from "react";

const ContextReader = () => {
  const { loading, data } = useContext(FormContactContext);
  return (
    <div data-testid="form-contact-values">
      {String(loading)}-{String(data)}
    </div>
  );
};

describe("FormContactContext", () => {
  it("provides default values when no provider is used", () => {
    render(<ContextReader />);

    expect(screen.getByTestId("form-contact-values").textContent).toBe(
      "false-undefined"
    );
  });

  it("uses provider values when available", () => {
    render(
      <FormContactContext.Provider value={{ loading: true, data: { test: 1 } as any }}>
        <ContextReader />
      </FormContactContext.Provider>
    );

    expect(screen.getByTestId("form-contact-values").textContent).toBe(
      "true-[object Object]"
    );
  });

  it("exports Provider and Consumer aliases", () => {
    expect(Provider).toBeDefined();
    expect(Consumer).toBeDefined();
  });
});
