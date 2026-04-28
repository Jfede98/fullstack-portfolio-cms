import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Typography } from "@shared-ui/components/typography";

describe("Typography component", () => {
  it("renders with default tag (span) and text", () => {
    render(<Typography children="Hello world" dataTestid="typography" />);

    const element = screen.getByTestId("typography");
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).toBe("span");
    expect(element.textContent).toBe("Hello world");
  });

  it("renders with custom tag", () => {
    render(
      <Typography
        tag="h2"
        children="Title"
        dataTestid="typography-title"
      />
    );

    const element = screen.getByTestId("typography-title");
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).toBe("h2");
  });

  it("applies custom base className", () => {
    render(
      <Typography
        children="With class"
        dataTestid="typography-class"
        className={{ base: "custom-class" }}
      />
    );

    const element = screen.getByTestId("typography-class");
    expect(element.className).to.include("custom-class");
  });

  it("applies underline style when underline is true", () => {
    render(
      <Typography
        children="Underlined text"
        underline
        dataTestid="typography-underline"
      />
    );

    const element = screen.getByTestId("typography-underline");
    expect(element.className).to.include("underline");
  });

  it("applies variant styles", () => {
    render(
      <Typography
        children="Hero text"
        variant="hero"
        dataTestid="typography-variant"
      />
    );

    const element = screen.getByTestId("typography-variant");
    expect(element.className.length).toBeGreaterThan(0);
  });

  it("renders even if text is undefined", () => {
    render(<Typography dataTestid="typography-empty" />);

    const element = screen.getByTestId("typography-empty");
    expect(element).to.exist;
  });

  it("preserves line breaks when preserveLineBreaks is true", () => {
    render(
      <Typography
        dataTestid="typography-linebreaks"
        preserveLineBreaks
      >
        {"line 1\nline 2"}
      </Typography>
    );

    const element = screen.getByTestId("typography-linebreaks");
    expect(element.className).to.include("whitespace-pre-line");
  });
});
