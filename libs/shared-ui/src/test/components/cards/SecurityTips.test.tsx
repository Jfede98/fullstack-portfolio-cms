import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SecurityTipsCard } from "@shared-ui/components/cards/securityTips";
import type { ISecurityTipsCardProps } from "@shared-ui/interfaces/cards/securityTipsCard.ts";

const defaultProps: ISecurityTipsCardProps = {
  title: "Mi título",
  description: "Descripción de ejemplo",
  iconName: "security",
  linkText: "Saber más",
  href: "https://example.com",
  linkIconName: "chevron_right"
};

describe("SecurityTipsCard component", () => {
  it("renders the card wrapper", () => {
    render(<SecurityTipsCard {...defaultProps} />);
    const wrapper = screen.getByTestId("security-card-wrapper");
    expect(wrapper).to.exist;
  });

  it("renders title and description correctly", () => {
    render(<SecurityTipsCard {...defaultProps} />);
    const title = screen.getByTestId("security-card-title");
    const description = screen.getByTestId("security-card-description");

    expect(title).to.exist;
    expect(title.textContent).to.equal("Mi título");

    expect(description).to.exist;
    expect(description.textContent).to.equal("Descripción de ejemplo");
  });

  it("does not render the link if href is not provided", () => {
    render(<SecurityTipsCard {...defaultProps} href={undefined} />);
    const link = screen.queryByTestId("security-card-link");
    expect(link).to.be.null;
  });

  it("applies custom className props", () => {
    render(
      <SecurityTipsCard
        {...defaultProps}
        className={{
          container: "custom-container",
          title: "custom-title",
          description: "custom-description",
          link: "custom-link"
        }}
      />
    );

    const wrapper = screen.getByTestId("security-card-wrapper");
    const title = screen.getByTestId("security-card-title");
    const description = screen.getByTestId("security-card-description");
    const link = screen.getByTestId("security-card-link");

    expect(wrapper.className).to.include("custom-container");
    expect(title.className).to.include("custom-title");
    expect(description.className).to.include("custom-description");
    expect(link.className).to.include("custom-link");
  });
});
