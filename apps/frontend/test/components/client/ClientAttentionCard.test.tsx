import { render, screen, fireEvent } from "@testing-library/react";
import { ClientAttentionCard } from "@components/client/ClientAttentionCard";

/* ------------------------------------------------------------------ */
/* MOCKS                                                              */
/* ------------------------------------------------------------------ */

const handlerCtaButton = jest.fn();
const gtmEvent = jest.fn();

jest.mock("@hooks/useClientAttentionCard", () => ({
  useClientAttentionCard: jest.fn()
}));

jest.mock("@sitio-publico/shared-ui", () => ({
  AttentionCard: jest.fn(({ button }) => (
    <div>
      <button onClick={button.onClick}>CTA</button>
    </div>
  ))
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, onClick, href, target }: any) => (
    <a href={href} target={target} onClick={onClick}>
      {children}
    </a>
  )
}));

import { useClientAttentionCard } from "@hooks/useClientAttentionCard";

/* ------------------------------------------------------------------ */
/* TESTS                                                              */
/* ------------------------------------------------------------------ */

describe("ClientAttentionCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders AttentionCard", () => {
    (useClientAttentionCard as jest.Mock).mockReturnValue({
      handlerCtaButton,
      isDesktop: false,
      gtmEvent
    });

    render(
      <ClientAttentionCard
        title="Test title"
        href="https://example.com"
        button={{ children: "CTA" }}
        iconName={""}
        text={""}
      />
    );

    expect(screen.getByText("CTA")).toBeInTheDocument();
  });

  it("calls handlerCtaButton when CTA is clicked (mobile)", () => {
    (useClientAttentionCard as jest.Mock).mockReturnValue({
      handlerCtaButton,
      isDesktop: false,
      gtmEvent
    });

    render(
      <ClientAttentionCard
        title="Test title"
        href="https://example.com"
        button={{ children: "CTA" }}
        iconName={""}
        text={""}
      />
    );

    fireEvent.click(screen.getByText("CTA"));

    expect(handlerCtaButton).toHaveBeenCalled();
    expect(gtmEvent).not.toHaveBeenCalled();
  });

  it("wraps card with Link and triggers gtmEvent on desktop", () => {
    (useClientAttentionCard as jest.Mock).mockReturnValue({
      handlerCtaButton,
      isDesktop: true,
      gtmEvent
    });

    render(
      <ClientAttentionCard
        title="Test title"
        href="https://example.com"
        button={{ children: "CTA" }}
        iconName={""}
        text={""}
      />
    );

    const link = screen.getByRole("link");
    fireEvent.click(link);

    expect(gtmEvent).toHaveBeenCalled();
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("still triggers handlerCtaButton when CTA is clicked on desktop", () => {
    (useClientAttentionCard as jest.Mock).mockReturnValue({
      handlerCtaButton,
      isDesktop: true,
      gtmEvent
    });

    render(
      <ClientAttentionCard
        title="Test title"
        href="https://example.com"
        button={{ children: "CTA" }}
        iconName={""}
        text={""}
      />
    );

    fireEvent.click(screen.getByText("CTA"));

    expect(handlerCtaButton).toHaveBeenCalled();
  });

  it("falls back to empty href when missing", () => {
    (useClientAttentionCard as jest.Mock).mockReturnValue({
      handlerCtaButton,
      isDesktop: true,
      gtmEvent
    });

    render(
      <ClientAttentionCard
        title="Test title"
        href={undefined}
        button={{ children: "CTA" }}
        iconName={""}
        text={""}
      />
    );

    const link = screen.getByText("CTA").closest("a");
    expect(link).not.toBeNull();
    expect(link).toHaveAttribute("href", "");
  });
});
