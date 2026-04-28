import React from "react";
import { render } from "@testing-library/react";
import { ClientFooter } from "@components/client/ClientFooter";
import type { IFooterProps } from "@sitio-publico/shared-ui";

const FooterMock = jest.fn((_props: IFooterProps) => <div data-testid="footer" />);

jest.mock("@sitio-publico/shared-ui", () => ({
  Footer: (props: any) => FooterMock(props)
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href?: string }) => (
    <a data-href={href}>{children}</a>
  )
}));

describe("ClientFooter", () => {
  beforeEach(() => {
    FooterMock.mockClear();
  });

  const mockFooterProps: IFooterProps = {
    links: [],
    linkPolicies: { href: "/politicas", label: "Políticas de privacidad" }
  };

  it("renders the Footer component", () => {
    render(<ClientFooter {...mockFooterProps} />);
    expect(FooterMock).toHaveBeenCalled();
  });

  it("injects Next.js Link as linkComponent", () => {
    render(<ClientFooter {...mockFooterProps} />);

    expect(FooterMock).toHaveBeenCalledWith(
      expect.objectContaining({
        linkComponent: expect.any(Function)
      })
    );
  });

  it("passes all props through to Footer", () => {
    render(<ClientFooter {...mockFooterProps} />);

    expect(FooterMock).toHaveBeenCalledWith(
      expect.objectContaining({
        links: mockFooterProps.links,
        linkPolicies: mockFooterProps.linkPolicies
      })
    );
  });

  it("forwards footerVariant='simple' to Footer", () => {
    render(<ClientFooter {...mockFooterProps} footerVariant="simple" />);

    expect(FooterMock).toHaveBeenCalledWith(
      expect.objectContaining({ footerVariant: "simple" })
    );
  });

  it("forwards footerVariant='none' to Footer", () => {
    render(<ClientFooter {...mockFooterProps} footerVariant="none" />);

    expect(FooterMock).toHaveBeenCalledWith(
      expect.objectContaining({ footerVariant: "none" })
    );
  });

  it("forwards footerVariant='no_items' to Footer", () => {
    render(<ClientFooter {...mockFooterProps} footerVariant="no_items" />);

    expect(FooterMock).toHaveBeenCalledWith(
      expect.objectContaining({ footerVariant: "no_items" })
    );
  });

  it("forwards footerVariant='default' to Footer", () => {
    render(<ClientFooter {...mockFooterProps} footerVariant="default" />);

    expect(FooterMock).toHaveBeenCalledWith(
      expect.objectContaining({ footerVariant: "default" })
    );
  });

  it("renders Footer without footerVariant when not provided", () => {
    render(<ClientFooter {...mockFooterProps} />);

    const receivedProps = FooterMock.mock.calls[0]?.[0];
    expect(receivedProps?.footerVariant).toBeUndefined();
  });
});
