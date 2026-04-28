import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { MobileListItems } from "@shared-ui/components/menus/navbar/mobileItems";
import { linksMapperNavbar } from "@shared-ui/helpers/menus";

vi.mock("@shared-ui/helpers/menus", () => ({
  linksMapperNavbar: vi.fn()
}));

vi.mock("@shared-ui/components/accordion", () => ({
  Accordion: ({ items }: any) => (
    <div data-testid="accordion">
      {items?.map((item: any, index: number) => (
        <div key={index} data-testid={`accordion-item-${index}`}>
          {item.title}
        </div>
      ))}
    </div>
  )
}));

describe("MobileListItems component", () => {
  const mockedLinksMapper = linksMapperNavbar as Mock;

  const mockItems = [
    { title: "Home", href: "/" },
    { title: "Products", href: "/products" }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Accordion component", () => {
    mockedLinksMapper.mockReturnValue(mockItems);

    render(<MobileListItems links={[]} />);

    expect(screen.getByTestId("accordion")).to.exist;
  });

  it("maps links using linksMapperNavbar", () => {
    mockedLinksMapper.mockReturnValue(mockItems);

    const links = [{ label: "Home" }];

    render(<MobileListItems links={links} />);

    expect(mockedLinksMapper).toHaveBeenCalledTimes(1);
  });

  it("renders mapped items inside Accordion", () => {
    mockedLinksMapper.mockReturnValue(mockItems);

    render(<MobileListItems links={[]} />);

    expect(screen.getByTestId("accordion-item-0").textContent).to.equal("Home");
    expect(screen.getByTestId("accordion-item-1").textContent).to.equal(
      "Products"
    );
  });

  it("does not break when links are undefined", () => {
    mockedLinksMapper.mockReturnValue([]);

    render(<MobileListItems />);

    expect(screen.getByTestId("accordion")).to.exist;
  });

  it("passes linkComponent without crashing", () => {
    mockedLinksMapper.mockReturnValue(mockItems);

    const LinkComponent = ({ children }: any) => <a>{children}</a>;

    render(<MobileListItems links={[]} linkComponent={LinkComponent} />);

    expect(screen.getByTestId("accordion")).to.exist;
  });
});
