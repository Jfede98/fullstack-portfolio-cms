import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { Bullet } from "@shared-ui/components/carousel/bullet";

describe("Bullet component", () => {
  it("renders inactive bullet by default", () => {
    render(<Bullet active={false} />);
    const bullet = screen.getByTestId("bullet-inactive");
    expect(bullet).to.exist;
    expect(bullet.className).to.exist;
  });

  it("renders active bullet without paused animation by default", () => {
    render(<Bullet active />);
    const bullet = screen.getByTestId("bullet-active");
    expect(bullet).to.exist;
    expect(bullet.className).to.not.contain("animate-bullet-paused");
  });

  it("applies the paused animation class when active and isPaused is true", () => {
    render(<Bullet active isPaused />);
    const bullet = screen.getByTestId("bullet-active");
    expect(bullet.className).to.contain("animate-bullet-paused");
  });

  it("calls onClick handler when clicked", async () => {
    const handleClick = vi.fn();
    render(<Bullet active onClick={handleClick} />);
    const bullet = screen.getByTestId("bullet-active");
    fireEvent.click(bullet);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onEnd handler on animation end only when active", () => {
    const handleEnd = vi.fn();

    render(<Bullet active onEnd={handleEnd} />);
    const activeBullet = screen.getByTestId("bullet-active");
    fireEvent.animationEnd(activeBullet);
    expect(handleEnd).toHaveBeenCalledTimes(1);

    const handleEndInactive = vi.fn();
    render(<Bullet active={false} onEnd={handleEndInactive} />);
    const inactiveBullet = screen.getByTestId("bullet-inactive");
    fireEvent.animationEnd(inactiveBullet);
    expect(handleEndInactive).toHaveBeenCalledTimes(0);
  });

  it("applies custom className if provided", () => {
    render(<Bullet active className={{ base: "custom-bullet" }} />);
    const bullet = screen.getByTestId("bullet-active");
    expect(bullet.className).to.contain("custom-bullet");
  });

  it("sets the CSS variable --bullet-duration correctly", () => {
    render(<Bullet active duration={5000} />);
    const bullet = screen.getByTestId("bullet-active");
    expect(bullet.style.getPropertyValue("--bullet-duration")).toBe("5000ms");
  });
});
