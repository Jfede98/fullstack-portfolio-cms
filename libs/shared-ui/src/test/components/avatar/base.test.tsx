import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Avatar } from "@shared-ui/components/avatar/base";

describe("Avatar Base", () => {
  it("renders an img with default alt", () => {
    render(<Avatar src="avatar.png" />);
    const img = screen.getByRole("img");
    expect(img.getAttribute("alt")).to.equal("avatar");
    expect(img.getAttribute("src")).to.equal("avatar.png");
  });

  it("uses the provided alt", () => {
    render(<Avatar src="avatar.png" alt="Profile picture" />);
    const img = screen.getByRole("img");
    expect(img.getAttribute("alt")).to.equal("Profile picture");
  });

  it("applies the size and border classes", () => {
    render(<Avatar src="avatar.png" size="sm" border />);
    const img = screen.getByRole("img");
    expect(img.className).to.include("w-8");
    expect(img.className).to.include("border-2"); 
  });

  it("applies custom className.base", () => {
    render(<Avatar src="avatar.png" className={{ base: "custom-class" }} />);
    const img = screen.getByRole("img");
    expect(img.className).to.include("custom-class");
  });

  it("spreads native img props", () => {
    render(
      <Avatar
        src="avatar.png"
        width={50}
        height={50}
        loading="lazy"
        data-testid="avatar-img"
      />
    );
    const img = screen.getByTestId("avatar-img");
    expect(img.getAttribute("width")).to.equal("50");
    expect(img.getAttribute("height")).to.equal("50");
    expect(img.getAttribute("loading")).to.equal("lazy");
  });
});
