import { render, screen } from "@testing-library/react";
import { HeroConfigContext, Provider } from "@context/heroConfig";
import { useContext } from "react";

const ContextReader = () => {
  const { horizontalFormOnDesktop } = useContext(HeroConfigContext);
  return (
    <div data-testid="hero-config-value">
      {String(horizontalFormOnDesktop)}
    </div>
  );
};

describe("HeroConfigContext", () => {
  it("provides default values when no provider is used", () => {
    render(<ContextReader />);

    expect(screen.getByTestId("hero-config-value").textContent).toBe("false");
  });

  it("provides custom values when provider is used", () => {
    render(
      <Provider value={{ horizontalFormOnDesktop: true }}>
        <ContextReader />
      </Provider>
    );

    expect(screen.getByTestId("hero-config-value").textContent).toBe("true");
  });

  it("provides false when horizontalFormOnDesktop is explicitly set to false", () => {
    render(
      <Provider value={{ horizontalFormOnDesktop: false }}>
        <ContextReader />
      </Provider>
    );

    expect(screen.getByTestId("hero-config-value").textContent).toBe("false");
  });

  it("provides undefined when horizontalFormOnDesktop is not provided", () => {
    render(
      <Provider value={{}}>
        <ContextReader />
      </Provider>
    );

    expect(screen.getByTestId("hero-config-value").textContent).toBe(
      "undefined"
    );
  });
});
