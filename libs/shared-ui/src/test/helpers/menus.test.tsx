import { describe, it, expect } from "vitest";
import { linksMapperFooter, linksMapperNavbar } from "../../lib/helpers/menus";

describe("linksMapperNavbar", () => {
  it("maps items with ReactNode children", () => {
    const children = <div data-testid="child">Child</div>;

    const result = linksMapperNavbar([
      {
        label: "Parent",
        children
      }
    ]);

    expect(result).toEqual([
      {
        title: "Parent",
        children
      }
    ]);
  });

  it("maps items with direct link and merges className", () => {
    const result = linksMapperNavbar(
      [
        {
          label: "Home",
          link: {
            href: "/",
            className: { base: "existing-class" }
          }
        }
      ],
      "extra-class"
    );

    expect(result).toEqual([
      {
        title: "Home",
        hiddenArrowIcon: true,
        link: {
          href: "/",
          className: {
            base: "existing-class extra-class"
          }
        }
      }
    ]);
  });

  it("maps items with links list and icons", () => {
    const result = linksMapperNavbar([
      {
        label: "Docs",
        links: [
          {
            href: "/a",
            label: "A",
            icon: { name: "star" }
          },
          {
            href: "/b",
            label: "B"
          }
        ]
      }
    ]);

    expect(result).toEqual([
      {
        title: "Docs",
        description: "\n- `icon:star` [A](/a) \n- `` [B](/b)"
      }
    ]);
  });

  it("handles empty input safely", () => {
    expect(linksMapperNavbar()).toEqual([]);
  });
});

describe("linksMapperFooter", () => {
  it("maps footer links to markdown", () => {
    const result = linksMapperFooter([
      {
        title: "Footer",
        link: [
          { href: "/home", label: "Home" },
          { href: "/about", label: "About" }
        ]
      }
    ]);

    expect(result).toEqual([
      {
        title: "Footer",
        description: "\n- [Home](/home) \n- [About](/about)"
      }
    ]);
  });

  it("handles missing title and links gracefully", () => {
    const result = linksMapperFooter([
      {
        title: undefined,
        link: undefined
      }
    ]);

    expect(result).toEqual([
      {
        title: "",
        description: ""
      }
    ]);
  });

  it("ignores null children and falls through", () => {
    const result = linksMapperNavbar([
      {
        label: "Item",
        children: null
      }
    ]);

    expect(result).toEqual([
      {
        title: "Item",
        description: ""
      }
    ]);
  });

  it("handles item without children, link or links", () => {
    const result = linksMapperNavbar([
      {
        label: "Empty"
      }
    ]);

    expect(result).toEqual([
      {
        title: "Empty",
        description: ""
      }
    ]);
  });

  it("handles undefined links list", () => {
    const result = linksMapperNavbar([
      {
        label: "Docs",
        links: undefined
      }
    ]);

    expect(result).toEqual([
      {
        title: "Docs",
        description: ""
      }
    ]);
  });

  it("handles links without icons", () => {
    const result = linksMapperNavbar([
      {
        label: "Docs",
        links: [{ href: "/a", label: "A" }]
      }
    ]);

    expect(result[0].description).toContain("[A](/a)");
  });
});
