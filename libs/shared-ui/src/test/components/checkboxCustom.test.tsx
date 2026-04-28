import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CheckboxCustom } from "@shared-ui/components/checkboxCustom";

describe("CheckboxCustom", () => {
  it("renders a checkbox with label text", () => {
    render(
      <CheckboxCustom
        name="consent"
        label="Acepto los terminos y condiciones"
      />
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).to.exist;
    expect(screen.getByText("Acepto los terminos y condiciones")).to.exist;
  });

  it("links the label with the input id", () => {
    const { container } = render(
      <CheckboxCustom name="consent" label="Autorizo el tratamiento" />
    );

    const checkbox = screen.getByRole("checkbox");
    const label = container.querySelector("label");

    expect(label).to.exist;
    expect(checkbox.getAttribute("id")).to.equal(label?.getAttribute("for"));
  });

  it("renders markdown links without paragraph wrappers", () => {
    const { container } = render(
      <CheckboxCustom
        name="consent"
        label="Acepto la [politica](https://xtrim.com/politica)"
      />
    );

    const link = screen.getByRole("link", { name: "politica" });
    expect(link.getAttribute("target")).to.equal("_blank");
    expect(link.getAttribute("rel")).to.equal("noopener noreferrer");
    expect(container.querySelector("p")).to.equal(null);
  });
});
