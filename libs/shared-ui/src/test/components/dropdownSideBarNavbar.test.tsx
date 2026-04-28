import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DropdownSidebarNavbar } from "@shared-ui/components/menus/navbar/dropdownSidebar";
import type { IDropdownNavbarProps } from "@shared-ui/interfaces/menus/navbar";
import type { ReactNode } from "react";

vi.mock("@shared-ui/components/menus/navbar/sessionButton", () => ({
  SessionLink: () => <div data-testid="session-link">SessionLink</div>
}));

vi.mock("@shared-ui/components/menus/navbar/mobileItems", () => ({
  MobileListItems: () => (
    <div data-testid="mobile-list-items">MobileListItems</div>
  )
}));

describe("DropdownSidebarNavbar", () => {
  const props: IDropdownNavbarProps = {
    linkComponent: ({ children }: { children: ReactNode }) => <a>{children}</a>,
    links: [],
    sessionLink: { label: "Login", href: "/login" }
  };

  it("renders navigation container", () => {
    render(<DropdownSidebarNavbar {...props} />);
    expect(screen.getByRole("navigation")).toBeTruthy();
  });

  it("renders SessionLink", () => {
    render(<DropdownSidebarNavbar {...props} />);
    expect(screen.getByTestId("session-link")).toBeTruthy();
  });

  it("renders MobileListItems", () => {
    render(<DropdownSidebarNavbar {...props} />);
    expect(screen.getByTestId("mobile-list-items")).toBeTruthy();
  });

  it("renders divider", () => {
    const { container } = render(<DropdownSidebarNavbar {...props} />);
    expect(container.querySelector("hr")).not.toBeNull();
  });
});
