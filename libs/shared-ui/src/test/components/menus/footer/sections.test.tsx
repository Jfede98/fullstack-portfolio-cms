import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LinkSections } from "@shared-ui/components/menus/footer/sections";
import type { ILinkSection } from "@shared-ui/interfaces/menus/footer";

// Mock del componente Link
vi.mock("@shared-ui/components/link", () => ({
  Link: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}));

describe("LinkSections component", () => {
  it("renders nothing when links is undefined", () => {
    const { container } = render(<LinkSections links={undefined} />);
    const wrapper = container.querySelector("div");
    expect(wrapper?.children.length).toBe(0);
  });

  it("renders nothing when links is an empty array", () => {
    const { container } = render(<LinkSections links={[]} />);
    const wrapper = container.querySelector("div");
    expect(wrapper?.children.length).toBe(0);
  });

  it("renders a single column correctly", () => {
    const links: ILinkSection["links"] = [
      {
        title: "Servicios",
        link: [
          { href: "#", label: "Planes para hogar" },
          { href: "#", label: "Planes para empresas" }
        ]
      }
    ];

    render(<LinkSections links={links} />);

    expect(screen.getByText("Servicios")).toBeDefined();
    expect(screen.getByText("Planes para hogar")).toBeDefined();
    expect(screen.getByText("Planes para empresas")).toBeDefined();
  });

  it("renders multiple columns correctly", () => {
    const links: ILinkSection["links"] = [
      {
        title: "Servicios",
        link: [{ href: "#", label: "Planes" }]
      },
      {
        title: "Empresa",
        link: [{ href: "#", label: "Nosotros" }]
      }
    ];

    render(<LinkSections links={links} />);

    expect(screen.getByText("Servicios")).toBeDefined();
    expect(screen.getByText("Empresa")).toBeDefined();
    expect(screen.getByText("Planes")).toBeDefined();
    expect(screen.getByText("Nosotros")).toBeDefined();
  });

  it("never renders RegulatoriosButton (removed from LinkSections)", () => {
    const links: ILinkSection["links"] = [
      {
        title: "Servicios",
        link: [{ href: "#", label: "Planes" }]
      }
    ];

    render(<LinkSections links={links} />);

    // El botón regulatorio ya no se renderiza en LinkSections
    // Se renderiza en el componente Footer padre, no aquí
    expect(screen.queryByText("Regulaciones legales")).toBeNull();
  });

  it("renders all links in each column", () => {
    const links: ILinkSection["links"] = [
      {
        title: "Servicios",
        link: [
          { href: "#1", label: "Link 1" },
          { href: "#2", label: "Link 2" },
          { href: "#3", label: "Link 3" }
        ]
      }
    ];

    render(<LinkSections links={links} />);

    expect(screen.getByText("Link 1")).toBeDefined();
    expect(screen.getByText("Link 2")).toBeDefined();
    expect(screen.getByText("Link 3")).toBeDefined();
  });
});
