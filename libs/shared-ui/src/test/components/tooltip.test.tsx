import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Tooltip } from "@shared-ui/components/tooltip";

describe("Tooltip Component", () => {
  const tooltipContent = "Mensaje de prueba";
  const triggerText = "Hover me";

  it("no debería mostrar el contenido por defecto", () => {
    render(
      <Tooltip content={tooltipContent}>
        <span>{triggerText}</span>
      </Tooltip>
    );

    const tooltip = screen.queryByRole("tooltip");
    expect(tooltip).to.not.exist;
  });

  it("debería mostrar el contenido al pasar el mouse (hover)", () => {
    render(
      <Tooltip content={tooltipContent}>
        <button>{triggerText}</button>
      </Tooltip>
    );

    const trigger = screen.getByText(triggerText);
    fireEvent.mouseEnter(trigger);

    const tooltip = screen.getByRole("tooltip");

    expect(tooltip).to.exist;
    expect(tooltip.textContent).to.equal(tooltipContent);
  });

  it("debería ocultar el contenido al quitar el mouse", () => {
    render(
      <Tooltip content={tooltipContent}>
        <span>{triggerText}</span>
      </Tooltip>
    );

    const trigger = screen.getByText(triggerText);

    fireEvent.mouseEnter(trigger);
    expect(screen.getByRole("tooltip")).to.exist;

    fireEvent.mouseLeave(trigger);

    expect(screen.queryByRole("tooltip")).to.not.exist;
  });

});
