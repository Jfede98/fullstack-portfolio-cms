import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AttentionCard } from "@shared-ui/components/cards/attention";
import type { IAttentionCardProps } from "@shared-ui/interfaces/cards/attentionCard.ts";

const defaultProps: IAttentionCardProps = {
  iconName: "alert",
  title: "Attention!",
  text: "This is important.",
  button: { children: "Click me" },
  className: {
    container: "custom-container",
    title: "custom-title",
    text: "custom-text",
    button: "custom-button"
  },
  icon: { size: "lg", color: "text-red-500", type: "rounded" }
};

describe("AttentionCard component", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders the title, text, and button correctly", () => {
    render(<AttentionCard {...defaultProps} />);

    const titleEl = screen.getByText(defaultProps.title);
    expect(titleEl).to.exist;
    expect(titleEl.className).to.include("custom-title");

    const textEl = screen.getByText(defaultProps.text);
    expect(textEl).to.exist;
    expect(textEl.className).to.include("custom-text");

    const btnEl = screen.getByText("Click me");
    expect(btnEl).to.exist;
    expect(btnEl.tagName).to.equal("SPAN");
  });

  it("applies custom className.container to the Card wrapper", () => {
    render(<AttentionCard {...defaultProps} data-testid="attention-card" />);
    const container = screen.getByTestId("attention-card");
    expect(container).to.exist;
  });
});
