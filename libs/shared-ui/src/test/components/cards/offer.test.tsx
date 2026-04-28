import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { OfferCard } from "@shared-ui/components/cards/offer";
import type { TOfferCardProps } from "@shared-ui/interfaces/cards/offer";

describe("OfferCard component", () => {
  const props: TOfferCardProps = {
    image: { src: "/test.png", alt: "Test image" },
    price: 99.99,
    title: "Special Offer",
    description: "This is a test description",
    link: { href: "/offer" },
    className: {
      base: "custom-base",
      img: "custom-img",
      containerInfo: "custom-container",
      price: "custom-price",
      title: "custom-title",
      description: "custom-description",
      link: "custom-link"
    }
  };

  it("renders Link with correct href and className", () => {
    render(<OfferCard {...props} offerHref={{ href: "/offer", titleHref: "Ver oferta" }} />);
    const link = screen.getByTestId("offer-card-cta-link");
    expect(link).to.exist;
    expect(link.getAttribute("href")).to.equal("/offer");
    expect(link.className).to.include("custom-link");
  });

  it("renders image with correct src, alt and className", () => {
    render(<OfferCard {...props} />);
    const img = screen.getByTestId("offer-card-img") as HTMLImageElement;
    expect(img).to.exist;
    expect(img.src).to.include("/test.png");
    expect(img.alt).to.equal("Test image");
    expect(img.className).to.include("custom-img");
  });

  it("renders info container with correct className", () => {
    render(<OfferCard {...props} />);
    const info = screen.getByTestId("offer-card-info");
    expect(info).to.exist;
    expect(info.className).to.include("custom-container");
  });

  it("renders price, title, and description correctly", () => {
    render(<OfferCard {...props} />);
    const price = screen.getByTestId("offer-card-price");
    const title = screen.getByTestId("offer-card-title");
    const description = screen.getByTestId("offer-card-description");

    expect(price).to.exist;
    expect(price.textContent).to.equal("$99.99");

    expect(title).to.exist;
    expect(title.textContent).to.equal("Special Offer");

    expect(description).to.exist;
    expect(description.textContent).to.equal("This is a test description");
  });

  it("does not render price when price is not provided", () => {
    const { price, ...propsWithoutPrice } = props;
    render(<OfferCard {...propsWithoutPrice} />);
    const priceElement = screen.queryByTestId("offer-card-price");
    expect(priceElement).to.equal(null);
  });

  it("does not render price when price is null", () => {
    render(<OfferCard {...props} price={null} />);
    const priceElement = screen.queryByTestId("offer-card-price");
    expect(priceElement).to.equal(null);
  });
});
