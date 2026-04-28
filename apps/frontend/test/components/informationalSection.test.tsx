import { render, screen } from "@testing-library/react";
import { InformationalSection } from "@components/informationalSection";
import type { IInformationalSection } from "@interfaces/components/informationalSection";
import type { IStreamingPlanCardProps } from "@shared-ui/interfaces/informationalSections.ts";

const InformationalSectionUIMock: any = jest.fn(() => (
  <div data-testid="informational-section-ui" />
));
const handlerCtaButtonMock = jest.fn();

jest.mock("@sitio-publico/shared-ui", () => ({
  InformationalSection: (props: any) => InformationalSectionUIMock(props)
}));

jest.mock("@hooks/useInformationalSection", () => ({
  useInformationalSection: () => ({
    handlerCtaButton: handlerCtaButtonMock
  })
}));

describe("InformationalSection", () => {
  const mockProps: IInformationalSection = {
    title: { text: "Título Principal", tag: "h2" },
    subtitle: { text: "Subtítulo Descriptivo", tag: "h3" },
    description: "Esta es una descripción detallada del contenido.",
    cta: {
      children: "Llamado a la Acción",
      color: "primary"
    },
    image: {
      src: "https://example.com/image.jpg",
      alt: "Imagen de ejemplo"
    }
  };

  beforeEach(() => {
    InformationalSectionUIMock.mockClear();
    handlerCtaButtonMock.mockClear();
  });

  it("renders and passes all props to InformationalSection UI component", () => {
    render(<InformationalSection {...mockProps} />);

    expect(screen.getByTestId("informational-section-ui")).toBeInTheDocument();
    expect(InformationalSectionUIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: { text: "Título Principal", tag: "h2" },
        subtitle: { text: "Subtítulo Descriptivo", tag: "h3" },
        description: "Esta es una descripción detallada del contenido.",
        cta: expect.objectContaining({
          children: "Llamado a la Acción",
          color: "primary"
        }),
        image: expect.objectContaining({
          src: "https://example.com/image.jpg",
          alt: "Imagen de ejemplo"
        })
      })
    );
  });

  it("renders with minimal props (without subtitle)", () => {
    const minimalProps: IInformationalSection = {
      title: { text: "Solo Título", tag: "h2" },
      description: "Descripción mínima",
      cta: {
        children: "Acción"
      },
      image: {
        src: "/image.jpg",
        alt: "Imagen"
      }
    };

    render(<InformationalSection {...minimalProps} />);

    expect(screen.getByTestId("informational-section-ui")).toBeInTheDocument();
    expect(InformationalSectionUIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: { text: "Solo Título", tag: "h2" },
        description: "Descripción mínima",
        cta: expect.objectContaining({
          children: "Acción"
        }),
        image: expect.objectContaining({
          src: "/image.jpg",
          alt: "Imagen"
        })
      })
    );
    // Verify subtitle is not passed when not provided
    expect(InformationalSectionUIMock.mock.calls[0][0]).not.toHaveProperty(
      "subtitle"
    );
  });

  it("passes through all props without modification", () => {
    const propsWithClassName: IStreamingPlanCardProps = {
      ...mockProps,
      className: {
        wrapper: "custom-wrapper",
        titleStyle: "custom-title"
      }
    };

    render(<InformationalSection {...propsWithClassName} />);

    expect(InformationalSectionUIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        className: expect.objectContaining({
          wrapper: "custom-wrapper",
          titleStyle: "custom-title"
        })
      })
    );
  });

  it("handles different button colors", () => {
    const propsWithSecondaryButton: IInformationalSection = {
      ...mockProps,
      cta: {
        children: "Botón Secundario",
        color: "secondary"
      }
    };

    render(<InformationalSection {...propsWithSecondaryButton} />);

    expect(InformationalSectionUIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        cta: expect.objectContaining({
          children: "Botón Secundario",
          color: "secondary"
        })
      })
    );
  });

  it("handles image without alt text", () => {
    const propsWithoutAlt: IInformationalSection = {
      ...mockProps,
      image: {
        src: "https://example.com/image.jpg"
      }
    };

    render(<InformationalSection {...propsWithoutAlt} />);

    expect(InformationalSectionUIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        image: expect.objectContaining({
          src: "https://example.com/image.jpg"
        })
      })
    );
    // Verify alt is not passed when not provided
    expect(InformationalSectionUIMock.mock.calls[0][0].image).not.toHaveProperty(
      "alt"
    );
  });

  it("sets onClick wrapper for modal CTA and calls handler", () => {
    render(
      <InformationalSection
        {...mockProps}
        cta={{
          children: "Abrir modal",
          color: "primary",
          identifier: 0,
          leadFormSelection: { leadFormDocumentId: "doc-1" } as any
        }}
      />
    );

    const passedProps = InformationalSectionUIMock.mock.calls[0][0];
    expect(typeof passedProps.cta.onClick).toBe("function");
    expect(passedProps.cta).not.toHaveProperty("leadFormSelection");

    passedProps.cta.onClick();
    expect(handlerCtaButtonMock).toHaveBeenCalledWith(
      expect.objectContaining({ identifier: 0 })
    );
  });

  it("does not set CTA when cta is missing", () => {
    render(
      <InformationalSection
        title={{ text: "Titulo", tag: "h2" }}
        description="Desc"
        image={{ src: "/img.jpg", alt: "img" }}
      />
    );

    const passedProps = InformationalSectionUIMock.mock.calls[0][0];
    expect(passedProps.cta).toBeUndefined();
  });
});

