import React from "react";
import { render } from "@testing-library/react";
import { OfferNavbarCard } from "@components/offerCard";

const OfferCardMock: any = jest.fn(() => <div data-testid="offer-card" />);

jest.mock("@sitio-publico/shared-ui", () => ({
  OfferCard: (props: any) => OfferCardMock(props)
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <a>{children}</a>
}));

describe("OfferNavbarCard", () => {
  it("maps cards and injects link component", () => {
    render(
      <OfferNavbarCard
        cards={[
          {
            title: "Plan",
            price: 10,
            description: "Desc",
            image: { src: "img.png", alt: "img" },
            offerHref: { href: "/plan", titleHref: "Ver plan" }
          }
        ]}
      />
    );

    expect(OfferCardMock).toHaveBeenCalledWith(
      expect.objectContaining({
        link: expect.objectContaining({
          href: "/plan",
          component: expect.any(Function)
        })
      })
    );
  });

  it("defaults href to # when missing", () => {
    OfferCardMock.mockClear();
    render(
      <OfferNavbarCard
        cards={[
          {
            title: "Plan",
            price: 10,
            description: "Desc",
            image: { src: "img.png", alt: "img" },
            offerHref: { href: "#", titleHref: "Ver" }
          }
        ]}
      />
    );

    expect(OfferCardMock).toHaveBeenCalledWith(
      expect.objectContaining({
        link: expect.objectContaining({
          href: "#"
        })
      })
    );
  });

  it("omits link when offerHref is not provided and does not render title when missing", () => {
    OfferCardMock.mockClear();
    const { container } = render(
      <OfferNavbarCard
        cards={[
          {
            title: "Plan sin href",
            price: 20,
            description: "Desc",
            image: { src: "img2.png", alt: "img2" }
          } as any
        ]}
      />
    );

    expect(OfferCardMock).toHaveBeenCalledWith(
      expect.objectContaining({
        link: undefined
      })
    );
    expect(container.querySelector("span")).toBeNull();
  });
});
