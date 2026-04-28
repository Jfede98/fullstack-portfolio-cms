import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InformationalSection } from "@shared-ui/components/informationalSection";
import type { IStreamingPlanCardProps } from "@shared-ui/interfaces/informationalSections";

describe("InformationalSection", () => {
  const mockData: IStreamingPlanCardProps = {
    title: { text: "Título Principal", tag: "h2" },
    subtitle: { text: "Subtítulo Descriptivo", tag: "h3" },
    description:
      "Esta es una descripción detallada que proporciona más información sobre el tema.",
    cta: {
      children: "Llamado a la Acción"
    },
    image: {
      src: "https://example.com/image.jpg",
      alt: "Imagen de ejemplo"
    }
  };

  it("renders the component with all elements", () => {
    render(<InformationalSection {...mockData} />);

    const title = screen.getByText(mockData.title.text);
    const subtitle = screen.getByText(mockData.subtitle!.text);
    const description = screen.getByText(mockData.description);
    const button = screen.getByRole("button");
    const image = screen.getByRole("img");

    expect(title).toBeDefined();
    expect(subtitle).toBeDefined();
    expect(description).toBeDefined();
    expect(button).toBeDefined();
    expect(image).toBeDefined();
  });

  it("renders the title with correct tag and text", () => {
    render(<InformationalSection {...mockData} />);

    const title = screen.getByText(mockData.title.text);
    expect(title.tagName.toLowerCase()).toBe("h2");
    expect(title.textContent).toBe("Título Principal");
  });

  it("renders the subtitle with correct tag and text", () => {
    render(<InformationalSection {...mockData} />);

    const subtitle = screen.getByText(mockData.subtitle!.text);
    expect(subtitle.tagName.toLowerCase()).toBe("h3");
    expect(subtitle.textContent).toBe("Subtítulo Descriptivo");
  });

  it("renders the description correctly", () => {
    render(<InformationalSection {...mockData} />);

    const description = screen.getByText(mockData.description);
    expect(description.textContent).toBe(mockData.description);
  });

  it("renders the button with correct text and default color", () => {
    render(<InformationalSection {...mockData} />);

    const button = screen.getByRole("button");
    expect(button.textContent).toBe("Llamado a la Acción");
  });

  it("renders the button with custom color when provided", () => {
    const dataWithCustomColor = {
      ...mockData,
      cta: { ...mockData.cta, color: "primary" as const }
    };

    render(<InformationalSection {...dataWithCustomColor} />);

    const button = screen.getByRole("button");
    expect(button).toBeDefined();
  });

  it("renders the image with correct src and alt attributes", () => {
    render(<InformationalSection {...mockData} />);

    const image = screen.getByRole("img") as HTMLImageElement;
    expect(image.src).toBe(mockData.image.src);
    expect(image.alt).toBe(mockData.image.alt);
  });

  it("renders the image with default alt text when not provided", () => {
    const dataWithoutAlt = {
      ...mockData,
      image: { src: "https://example.com/image.jpg" }
    };

    render(<InformationalSection {...dataWithoutAlt} />);

    const image = screen.getByRole("img") as HTMLImageElement;
    expect(image.alt).toBe("informational-section-image");
  });

  it("renders without subtitle when not provided", () => {
    const dataWithoutSubtitle = {
      ...mockData,
      subtitle: undefined
    };

    render(<InformationalSection {...dataWithoutSubtitle} />);

    const title = screen.getByText(mockData.title.text);
    expect(title).toBeDefined();
    const subtitle = screen.queryByText("Subtítulo Descriptivo");
    expect(subtitle).toBeNull();
  });

  it("applies custom className props", () => {
    const dataWithClassName = {
      ...mockData,
      className: {
        wrapper: "custom-wrapper",
        titleStyle: "custom-title",
        subtitleStyle: "custom-subtitle",
        descriptionStyle: "custom-description",
        imageContainer: "custom-image-container",
        imageStyle: "custom-image",
        textContainer: "custom-text-container"
      }
    };

    const { container } = render(<InformationalSection {...dataWithClassName} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("custom-wrapper");

    const title = screen.getByText(mockData.title.text);
    expect(title.className).toContain("custom-title");

    const subtitle = screen.getByText(mockData.subtitle!.text);
    expect(subtitle.className).toContain("custom-subtitle");

    const descriptionDiv = container.querySelector(".custom-description");
    expect(descriptionDiv).toBeDefined();
    expect(descriptionDiv?.textContent).toContain(mockData.description);
  });

  it("renders with different title tags", () => {
    const dataWithH1 = {
      ...mockData,
      title: { text: "Título H1", tag: "h1" as const }
    };

    render(<InformationalSection {...dataWithH1} />);

    const title = screen.getByText("Título H1");
    expect(title.tagName.toLowerCase()).toBe("h1");
  });

  it("does not render button when cta is undefined", () => {
    const dataWithoutCta = {
      ...mockData,
      cta: undefined
    };

    render(<InformationalSection {...dataWithoutCta} />);

    const button = screen.queryByRole("button");
    expect(button).toBeNull();
  });

  it("does not render button when cta has no children", () => {
    const dataWithEmptyCta = {
      ...mockData,
      cta: { children: "" }
    };

    render(<InformationalSection {...dataWithEmptyCta} />);

    const button = screen.queryByRole("button");
    expect(button).toBeNull();
  });

  it("renders with different subtitle tags", () => {
    const dataWithH4 = {
      ...mockData,
      subtitle: { text: "Subtítulo H4", tag: "h4" as const }
    };

    render(<InformationalSection {...dataWithH4} />);

    const subtitle = screen.getByText("Subtítulo H4");
    expect(subtitle.tagName.toLowerCase()).toBe("h4");
  });
});


