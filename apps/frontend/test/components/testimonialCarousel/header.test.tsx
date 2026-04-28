import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { Header } from "@components/testimonialCarousel/header";

const handlerCtaButton = jest.fn();
const ButtonMock = jest.fn(({ children }: any) => <button>{children}</button>);

jest.mock("@hooks/useTestimonialCarousel", () => ({
  useTestimonialCarousel: () => ({ handlerCtaButton })
}));

jest.mock("@sitio-publico/shared-ui", () => ({
  Button: (props: any) => ButtonMock(props),
  Typography: ({ children, text }: { children?: ReactNode; text?: string }) => (
    <div>{children ?? text}</div>
  )
}));

describe("Header", () => {
  it("renders title, description, and button", () => {
    render(
      <Header
        title={{ text: "Titulo", tag: "h2" }}
        description="Desc"
        button={{ label: "Ver", size: "lg", variant: "primary" } as any}
      />
    );

    expect(screen.getByText("Titulo")).toBeInTheDocument();
    expect(screen.getByText("Desc")).toBeInTheDocument();
    expect(ButtonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        children: "Ver",
        onClick: expect.any(Function),
        color: "primary"
      })
    );

    const buttonProps = ButtonMock.mock.calls[0][0];
    buttonProps.onClick();
    expect(handlerCtaButton).toHaveBeenCalledWith(
      expect.objectContaining({ label: "Ver" })
    );
  });

  it("skips button when label is missing", () => {
    ButtonMock.mockClear();
    render(
      <Header
        title={{ text: "Titulo", tag: "h2" }}
        description="Desc"
        button={{ label: "" }}
      />
    );
    expect(ButtonMock).not.toHaveBeenCalled();
  });

  it("handles undefined button gracefully", () => {
    ButtonMock.mockClear();
    render(
      <Header
        title={{ text: "Titulo", tag: "h2" }}
      />
    );
    expect(ButtonMock).not.toHaveBeenCalled();
  });

  it("renders with link type when href is provided", () => {
    render(
      <Header
        title={{ text: "Titulo", tag: "h2" }}
        button={{ label: "Link", href: "/test" } as any}
      />
    );
    expect(ButtonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "link",
        href: "/test"
      })
    );
  });
});
