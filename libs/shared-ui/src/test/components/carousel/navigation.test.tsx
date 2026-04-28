import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navigation } from "@shared-ui/components/carousel/navigation";
import type { INavigationProps } from "@shared-ui/interfaces/carousel/navigation";

vi.mock("@shared-ui/components/carousel/arrow", () => ({
  Arrow: ({ id }: { id: string }) => <div data-testid={`arrow-${id}`} />
}));
vi.mock("@shared-ui/components/avatar/group", () => ({
  AvatarGroup: ({ id }: { id?: string }) => (
    <div data-testid={`avatar-group-${id || "default"}`} />
  )
}));

describe("Navigation component", () => {
  const defaultProps: INavigationProps = {
    buttons: [
      { id: "left", direction: "left" as const },
      { id: "right", direction: "right" as const }
    ],
    text: "Slide 1 of 5",
    avatarGroup: {
      id: "group1",
      avatars: []
    } as INavigationProps["avatarGroup"],
    className: { base: "custom-base", text: "custom-text" }
  };

  it("renders left and right arrows", () => {
    render(<Navigation {...defaultProps} />);
    const leftArrow = screen.getByTestId("arrow-left");
    const rightArrow = screen.getByTestId("arrow-right");
    expect(leftArrow).to.exist;
    expect(rightArrow).to.exist;
  });

  it("renders AvatarGroup if provided", () => {
    render(<Navigation {...defaultProps} />);
    const avatarGroup = screen.getByTestId("avatar-group-group1");
    expect(avatarGroup).to.exist;
  });

  it("renders text if provided and applies custom className", () => {
    render(<Navigation {...defaultProps} />);
    const textSpan = screen.getByText("Slide 1 of 5");
    expect(textSpan).to.exist;
    expect(textSpan.className).to.include("custom-text");
  });
});
