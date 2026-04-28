import { render, screen } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import { AvatarGroup } from "@shared-ui/components/avatar/group";
import * as hook from "@shared-ui/hooks/avatar/useAvatarGroup";

describe("AvatarGroup", () => {
  const avatarsMock = [
    { src: "avatar1.png" },
    { src: "avatar2.png" },
    { src: "avatar3.png" }
  ];

  beforeEach(() => {
    vi.spyOn(hook, "useAvatarGroup").mockReturnValue({
      sortedAvatars: avatarsMock
    });
  });

  it("renders all avatars", () => {
    render(<AvatarGroup avatars={avatarsMock} />);

    const images = screen.getAllByRole("img");
    expect(images.length).to.equal(3);
    expect(images[0].getAttribute("src")).to.equal("avatar1.png");
    expect(images[1].getAttribute("src")).to.equal("avatar2.png");
    expect(images[2].getAttribute("src")).to.equal("avatar3.png");
  });

  it("applies custom className.base and className.wrapper", () => {
    render(
      <AvatarGroup
        avatars={avatarsMock}
        className={{ base: "custom-base", wrapper: "custom-wrapper" }}
      />
    );

    const container = screen.getByTestId("avatar-group-container");
    expect(container.className).to.include("custom-base");

    const wrappers = screen.getAllByTestId("avatar-group-wrapper");
    wrappers.forEach((wrapper) => {
      expect(wrapper.className).to.include("custom-wrapper");
    });
  });

  it("passes size and border to each Avatar", () => {
    render(<AvatarGroup avatars={avatarsMock} size="sm" border />);

    const images = screen.getAllByRole("img");
    images.forEach((img) => {
      expect(img.className).to.include("w-8"); 
      expect(img.className).to.include("border-2"); 
    });
  });
});
