/* eslint-disable @typescript-eslint/no-unused-expressions */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { colorLoaderVariant, createRipple } from "@shared-ui/helpers/button";
import type { MouseEvent } from "react";

export const createMouseEvent = (
  element: HTMLElement,
  { x = 50, y = 25 } = {}
) =>
  ({
    currentTarget: element,
    clientX: x,
    clientY: y
  }) as unknown as MouseEvent<HTMLElement>;


export const createDivButton = () => {
  const div = document.createElement("div");
  document.body.appendChild(div);
  return div;
};


describe("Button utils", () => {
  it("exposes the correct color loader variants", () => {
    expect(colorLoaderVariant).to.deep.equal({
      primary: "bg-primary-50",
      secondary: "bg-primary",
      outline: "bg-primary",
      tertiary: "bg-white",
      noBorder: "bg-primary",
      whatsapp: "bg-white"
    });
  });

  describe("createRipple", () => {
    let button: HTMLElement;

    beforeEach(() => {
      document.body.innerHTML = "";
      button = createDivButton();

      vi.spyOn(button, "clientWidth", "get").mockReturnValue(100);
      vi.spyOn(button, "clientHeight", "get").mockReturnValue(100);

      vi.spyOn(button, "getBoundingClientRect").mockReturnValue({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        x: 0,
        y: 0,
        right: 100,
        bottom: 100,
        toJSON: () => {}
      } as DOMRect);
    });

    it("does nothing when disabled", () => {
      createRipple(createMouseEvent(button), true);
      expect(button.querySelector(".ripple-span")).to.be.null;
    });

    it("creates a ripple span with correct size", () => {
      createRipple(createMouseEvent(button), false);
      const ripple = button.querySelector(".ripple-span") as HTMLSpanElement;
      expect(ripple).to.exist;
      expect(ripple.style.width).to.equal("100px");
      expect(ripple.style.height).to.equal("100px");
    });

    it("replaces an existing ripple", () => {
      const event = createMouseEvent(button);
      createRipple(event, false);
      createRipple(event, false);
      expect(button.getElementsByClassName("ripple-span")).to.have.length(1);
    });

    it("positions the ripple correctly when click is off-center", () => {
      const event = createMouseEvent(button, { x: 10, y: 10 });
      createRipple(event, false);

      const ripple = button.querySelector(".ripple-span") as HTMLSpanElement;
      expect(ripple).to.exist;
      expect(ripple.style.left).to.equal("-40px"); 
      expect(ripple.style.top).to.equal("-40px");
    });

    it("removes previous ripple when multiple exist", () => {
      const oldRipple = document.createElement("span");
      oldRipple.classList.add("ripple-span");
      button.appendChild(oldRipple);

      createRipple(createMouseEvent(button), false);

      expect(button.getElementsByClassName("ripple-span")).to.have.length(1);
    });
  });
});
