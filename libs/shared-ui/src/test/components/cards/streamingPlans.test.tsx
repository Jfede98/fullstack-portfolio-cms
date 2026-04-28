import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StreamingPlans } from "@shared-ui/components/cards/streamingPlans";
import type { IStreamingPlansProps } from "@shared-ui/interfaces/cards/streamingPlans";

describe("StreamingPlans component", () => {
  const props: IStreamingPlansProps = {
    title: {
      text: "Planes de Streaming",
      tag: "h2"
    },
    subtitle: {
      text: "Encuentra el mejor plan para ti",
      tag: "p"
    },
    plans: [
      {
        title: "Zapping",
        description: "Disfruta tus canales favoritos con la mejor calidad.",
        image: {
          src: "/assets/svg/Zapping.svg",
          alt: "Zapping"
        },
        badgeText: "Nuevo",
        ctas: [
          {
            label: "Contratar ahora",
            href: "#"
          }
        ]
      },
      {
        title: "HBO Max",
        description: "Series y peliculas premium para toda la familia.",
        image: {
          src: "/assets/svg/HBO.svg",
          alt: "HBO Max"
        },
        ctas: [
          {
            label: "Contratar ahora",
            href: "#"
          }
        ]
      }
    ],
    layout: {
      mobile: "grid",
      desktop: "grid"
    },
    className: {
      wrapper: "custom-wrapper",
      title: "custom-title",
      subtitle: "custom-subtitle",
      cardsContainer: "custom-container"
    }
  };

  it("renders wrapper with correct data-testid and className", () => {
    render(<StreamingPlans {...props} />);
    const wrapper = screen.getByTestId("streaming-plans");
    expect(wrapper).to.exist;
    expect(wrapper.className).to.include("custom-wrapper");
  });

  it("renders title with correct text, tag and className", () => {
    render(<StreamingPlans {...props} />);
    const titleContainer = screen.getByTestId("streaming-plans-title");
    expect(titleContainer).to.exist;

    const titleElement = screen.getByText("Planes de Streaming");
    expect(titleElement).to.exist;
    expect(titleElement.tagName).to.equal("H2");
    expect(titleElement.className).to.include("custom-title");
  });

  it("renders subtitle with correct text, tag and className", () => {
    render(<StreamingPlans {...props} />);
    const subtitleElement = screen.getByText("Encuentra el mejor plan para ti");
    expect(subtitleElement).to.exist;
    expect(subtitleElement.tagName).to.equal("P");
    expect(subtitleElement.className).to.include("custom-subtitle");
  });

  it("renders without subtitle when not provided", () => {
    const propsWithoutSubtitle = {
      ...props,
      subtitle: undefined
    };
    render(<StreamingPlans {...propsWithoutSubtitle} />);

    expect(screen.getByText("Planes de Streaming")).to.exist;
    expect(screen.queryByText("Encuentra el mejor plan para ti")).to.not.exist;
  });

  it("renders all plan cards in grid layout", () => {
    render(<StreamingPlans {...props} />);
    const cardsContainer = screen.getByTestId("streaming-plans-cards");
    expect(cardsContainer).to.exist;
    expect(cardsContainer.className).to.include("custom-container");

    expect(screen.getByText("Zapping")).to.exist;
    expect(screen.getByText("HBO Max")).to.exist;
  });

  it("renders cards with correct descriptions", () => {
    render(<StreamingPlans {...props} />);

    const description1 = screen.getByText("Disfruta tus canales favoritos con la mejor calidad.");
    expect(description1).to.exist;

    const description2 = screen.getByText("Series y peliculas premium para toda la familia.");
    expect(description2).to.exist;
  });

  it("renders with h1 tag for title", () => {
    const propsWithH1 = {
      ...props,
      title: {
        text: "Main Title",
        tag: "h1" as const
      }
    };
    render(<StreamingPlans {...propsWithH1} />);

    const titleElement = screen.getByText("Main Title");
    expect(titleElement).to.exist;
    expect(titleElement.tagName).to.equal("H1");
  });

  it("renders carousel layout when configured", () => {
    const carouselProps: IStreamingPlansProps = {
      ...props,
      layout: {
        mobile: "carousel",
        desktop: "grid"
      },
      carousel: {
        mobile: {
          slidesPerView: 1.05,
          spaceBetween: 16
        }
      }
    };
    render(<StreamingPlans {...carouselProps} />);

    const wrapper = screen.getByTestId("streaming-plans");
    expect(wrapper).to.exist;
  });
});
