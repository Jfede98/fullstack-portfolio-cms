import { it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTab } from "../../lib/hooks/useTab";

it("should scroll the container when activeIndex changes", () => {
  const scrollToMock = vi.fn();

  const container = document.createElement("div");
  Object.defineProperty(container, "offsetWidth", {
    value: 200,
    configurable: true
  });
  container.scrollTo = scrollToMock;

  for (let i = 0; i < 5; i++) {
    const child = document.createElement("div");
    Object.defineProperty(child, "offsetLeft", {
      value: i * 50,
      configurable: true
    });
    Object.defineProperty(child, "offsetWidth", {
      value: 50,
      configurable: true
    });
    container.appendChild(child);
  }

  const { result } = renderHook(() => useTab());

  act(() => {
    result.current.navRef.current = container;
  });

  act(() => {
    result.current.handlerClickerActive(2);
  });

  const activeTabElement = container.children[2] as HTMLElement;
  const expectedScrollLeft =
    activeTabElement.offsetLeft -
    container.offsetWidth / 2 +
    activeTabElement.offsetWidth / 2;

  expect(scrollToMock).toHaveBeenCalledWith({
    left: expectedScrollLeft,
    behavior: "smooth"
  });
});
