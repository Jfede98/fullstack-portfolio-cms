import { render } from "@testing-library/react";
import { ClientNavbar } from "@components/client/ClientNavbar";
import type { INavbarProps } from "@sitio-publico/shared-ui";

const NavbarMock = jest.fn((_props: INavbarProps) => <div data-testid="navbar" />);
const handlerContactButton = jest.fn();

jest.mock("@hooks/useNavbar", () => ({
  useNavbar: () => ({ handlerContactButton })
}));

jest.mock("@sitio-publico/shared-ui", () => ({
  Navbar: (props: INavbarProps) => NavbarMock(props)
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href?: string }) => (
    <a data-href={href}>{children}</a>
  )
}));

describe("ClientNavbar", () => {
  beforeEach(() => {
    NavbarMock.mockClear();
  });

  const mockNavbarProps: INavbarProps = {
    logo: {
      src: "/logo.png",
      alt: "Logo"
    },
    buttonContact: {
      children: "Contactar",
      color: "primary",
      type: "button"
    },
    sessionLink: {
      label: "Iniciar sesión",
      href: "/login"
    },
    links: [
      { label: "Inicio", link: { href: "/", target: "_self" } },
      { label: "Planes", link: { href: "/planes", target: "_self" } }
    ],
    navbarTop: [
      { href: "/ayuda", label: "Ayuda", target: "_self" }
    ]
  };

  it("renders the Navbar component", () => {
    render(<ClientNavbar {...mockNavbarProps} />);
    expect(NavbarMock).toHaveBeenCalled();
  });

  it("passes all props through to Navbar", () => {
    render(<ClientNavbar {...mockNavbarProps} />);

    expect(NavbarMock).toHaveBeenCalledWith(
      expect.objectContaining({
        logo: mockNavbarProps.logo,
        links: mockNavbarProps.links,
        sessionLink: mockNavbarProps.sessionLink,
        navbarTop: mockNavbarProps.navbarTop
      })
    );
  });

  it("injects Next.js Link as linkComponent", () => {
    render(<ClientNavbar {...mockNavbarProps} />);

    expect(NavbarMock).toHaveBeenCalledWith(
      expect.objectContaining({
        linkComponent: expect.any(Function)
      })
    );
  });

  it("injects contact button handler from useNavbar hook", () => {
    render(<ClientNavbar {...mockNavbarProps} />);

    expect(NavbarMock).toHaveBeenCalledWith(
      expect.objectContaining({
        buttonContact: expect.objectContaining({
          children: "Contactar",
          onClick: handlerContactButton
        })
      })
    );
  });

  it("preserves all original buttonContact props while injecting onClick", () => {
    render(<ClientNavbar {...mockNavbarProps} />);

    const receivedProps = NavbarMock.mock.calls[0]?.[0];
    expect(receivedProps?.buttonContact).toEqual(
      expect.objectContaining({
        children: "Contactar",
        color: "primary",
        type: "button",
        onClick: handlerContactButton
      })
    );
  });

  it("forwards navbarVariant prop to Navbar", () => {
    render(<ClientNavbar {...mockNavbarProps} navbarVariant="simple" />);

    expect(NavbarMock).toHaveBeenCalledWith(
      expect.objectContaining({ navbarVariant: "simple" })
    );
  });

  it("forwards navbarVariant='none' to Navbar", () => {
    render(<ClientNavbar {...mockNavbarProps} navbarVariant="none" />);

    expect(NavbarMock).toHaveBeenCalledWith(
      expect.objectContaining({ navbarVariant: "none" })
    );
  });

  it("forwards navbarVariant='no_items' to Navbar", () => {
    render(<ClientNavbar {...mockNavbarProps} navbarVariant="no_items" />);

    expect(NavbarMock).toHaveBeenCalledWith(
      expect.objectContaining({ navbarVariant: "no_items" })
    );
  });

  it("removes leadFormSelection from buttonContact before forwarding", () => {
    const buttonWithLead = {
      ...(mockNavbarProps.buttonContact ?? {}),
      leadFormSelection: { id: "x" }
    } as unknown as INavbarProps["buttonContact"];

    render(<ClientNavbar {...mockNavbarProps} buttonContact={buttonWithLead} />);

    const receivedProps = NavbarMock.mock.calls[0]?.[0];
    const receivedButtonContact = receivedProps?.buttonContact as Record<string, unknown> | undefined;
    expect(receivedButtonContact?.leadFormSelection).toBeUndefined();
  });

  it("handles undefined buttonContact gracefully and still injects onClick", () => {
    render(<ClientNavbar {...{ ...mockNavbarProps, buttonContact: undefined }} />);

    const receivedProps = NavbarMock.mock.calls[0]?.[0];
    expect(receivedProps?.buttonContact).toEqual(
      expect.objectContaining({ onClick: handlerContactButton })
    );
  });
});
