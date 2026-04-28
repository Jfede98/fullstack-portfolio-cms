import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StreamingPlanCard } from "@shared-ui/components/cards/streamingPlans";
import type { IStreamingPlanCardProps } from "@shared-ui/interfaces/cards/streamingPlans";

describe("StreamingPlanCard component", () => {
  const props: IStreamingPlanCardProps = {
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
      },
      {
        label: "Contratar por WhatsApp",
        href: "https://wa.me/1234567890",
        icon: "WhatsappVector"
      }
    ],
    className: {
      card: "custom-card",
      image: "custom-image",
      cardTitle: "custom-title",
      cardDescription: "custom-description"
    },
    dataTestid: "test-card"
  };

  it("renders card with correct data-testid and className", () => {
    render(<StreamingPlanCard {...props} />);
    const card = screen.getByTestId("test-card");
    expect(card).to.exist;
    expect(card.className).to.include("custom-card");
  });

  it("renders image with correct src, alt and className", () => {
    render(<StreamingPlanCard {...props} />);
    const image = screen.getByAltText("Zapping") as HTMLImageElement;
    expect(image).to.exist;
    expect(image.src).to.include("/assets/svg/Zapping.svg");
    expect(image.className).to.include("custom-image");
  });

  it("renders badge when badgeText is provided", () => {
    render(<StreamingPlanCard {...props} />);
    const badge = screen.getByText("Nuevo");
    expect(badge).to.exist;
  });

  it("does not render badge when badgeText is not provided", () => {
    const propsWithoutBadge = {
      ...props,
      badgeText: undefined
    };
    render(<StreamingPlanCard {...propsWithoutBadge} />);
    expect(screen.queryByText("Nuevo")).to.not.exist;
  });

  it("renders title with correct text and className", () => {
    render(<StreamingPlanCard {...props} />);
    const title = screen.getByText("Zapping");
    expect(title).to.exist;
    expect(title.className).to.include("custom-title");
  });

  it("renders description with correct text and className", () => {
    render(<StreamingPlanCard {...props} />);
    const description = screen.getByText("Disfruta tus canales favoritos con la mejor calidad.");
    expect(description).to.exist;
    expect(description.className).to.include("custom-description");
  });

  it("renders primary CTA button", () => {
    render(<StreamingPlanCard {...props} />);
    const primaryCta = screen.getByText("Contratar ahora");
    expect(primaryCta).to.exist;
  });

  it("renders multiple CTA buttons", () => {
    render(<StreamingPlanCard {...props} />);
    const primaryCta = screen.getByText("Contratar ahora");
    const secondaryCta = screen.getByText("Contratar por WhatsApp");

    expect(primaryCta).to.exist;
    expect(secondaryCta).to.exist;
  });

  it("renders image without alt text when not provided", () => {
    const propsWithoutAlt = {
      ...props,
      badgeText: undefined,
      ctas: [
        {
          label: "Contratar ahora",
          href: "#"
        }
      ],
      image: {
        src: "/assets/svg/Zapping.svg"
      }
    };
    render(<StreamingPlanCard {...propsWithoutAlt} />);
    const imageContainer = screen.getByTestId("streaming-plan-card-image");
    expect(imageContainer).to.exist;
    const image = imageContainer.querySelector("img") as HTMLImageElement;
    expect(image).to.exist;
    expect(image.src).to.include("/assets/svg/Zapping.svg");
  });

  it("renders with single CTA button", () => {
    const propsWithSingleCta = {
      ...props,
      ctas: [
        {
          label: "Ver detalles",
          href: "#details",
          color: "secondary" as const
        }
      ]
    };
    render(<StreamingPlanCard {...propsWithSingleCta} />);

    const cta = screen.getByText("Ver detalles");
    expect(cta).to.exist;
  });
});

