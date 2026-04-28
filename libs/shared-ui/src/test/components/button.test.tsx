import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "@shared-ui/components/button";

describe("Button", () => {
  it("renders a button element with children", () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDefined();
    expect(btn.tagName).toBe("BUTTON");
    expect(btn.textContent).toBe("Click me");
  });

  it("applies custom className.base", () => {
    render(<Button className={{ base: "custom-class" }}>Click</Button>);
    const btn = screen.getByRole("button");
    expect(btn.className).toContain("custom-class");
  });

  it("disables button when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole("button");
    expect(btn.getAttribute("disabled")).toBe("");
  });

  it("sets type attribute correctly", () => {
    render(<Button type="submit">Submit</Button>);
    const btn = screen.getByRole("button");
    expect(btn.getAttribute("type")).toBe("submit");
  });

  it("calls onClick when clicked", () => {
    let clicked = false;
    render(
      <Button onClick={() => (clicked = true)}>Click me</Button>
    );
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    expect(clicked).toBe(true);
  });

  it("renders as an <a> tag if type is link", () => {
    render(
      <Button type="link" href="/home" target="_blank">
        Go Home
      </Button>
    );
    const btn = screen.getByRole("button");
    expect(btn.tagName).toBe("A");
    expect(btn.getAttribute("href")).toBe("/home");
    expect(btn.getAttribute("target")).toBe("_blank");
    expect(btn.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("sets aria-disabled and tabIndex for disabled links", () => {
    render(
      <Button type="link" href="/home" disabled>
        Disabled Link
      </Button>
    );
    const btn = screen.getByRole("button");
    expect(btn.getAttribute("aria-disabled")).toBe("true");
    expect(btn.getAttribute("tabindex")).toBe("-1");
  });

  it("renders loader span when loading", () => {
    render(<Button loading color="primary">Loading</Button>);
    const loader = screen.getByText("", { selector: "span.loader" });
    expect(loader).toBeDefined();
    expect(loader.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders material icon when icon is not WhatsappVector", () => {
    render(<Button icon="search">Search</Button>);
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("search")).toBeDefined();
  });

  it("renders image icon only for WhatsappVector", () => {
    render(<Button icon="WhatsappVector">Search</Button>);
    const img = screen.getByRole("img");
    expect(img).toBeDefined();
    expect(img.getAttribute("src")).toBe("/assets/svg/WhatsappVector.svg");
    expect(img.getAttribute("alt")).toBe("btn-WhatsappVector");
  });
});
