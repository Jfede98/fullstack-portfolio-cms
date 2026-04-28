import { mapTestimonial } from "@lib/helpers/mappers/testimonial";

describe("mapTestimonial", () => {
  it("maps testimonials and features", () => {
    const res = mapTestimonial({
      title: { text: "Title", tag: "h2" },
      description: "Desc",
      ctaButton: { label: "CTA", href: "/x", identifier: "simple" },
      testimonials: [
        { id: 1, review: "Good", author: "A", rating: "4,5" },
        { id: 2, review: "", author: "", rating: "0" }
      ],
      features: [
        { name: "F", description: "D", icon: { name: "wifi" } },
        { name: "No", description: "D", icon: { name: "" } }
      ]
    } as any);

    expect(res.title.text).toBe("Title");
    expect(res.testimonials.length).toBe(1);
    expect(res.features?.length).toBe(1);
    expect(res.button?.label).toBe("CTA");
  });

  it("handles missing fields across buttons, rating normalization and icon mapping gracefully", () => {
    const res = mapTestimonial({
      ctaButton: { href: "/test" },
      testimonials: [
        { id: 10, review: "Hey", rating: 4 },
        { rating: "NaN" },
        { id: 2 }
      ],
      features: [
        { icon: [{ name: "" }] },
        { icon: null }
      ]
    } as any);

    expect(res.title.text).toBe("");
    expect(res.description).toBe("");
    expect(res.button).toBeUndefined();
    expect(res.testimonials).toHaveLength(1);
    expect(res.testimonials[0].rating).toBe(4);
    expect(res.features).toEqual([]);
  });

  it("handles alternative variant colors for buttons", async () => {
    jest.resetModules();
    jest.mock("@lib/helpers/mappers/button", () => ({
      mapButton: () => ({ children: "Test", color: "secondary" })
    }));
    const { mapTestimonial: mockedMapTestimonial } = await import("@lib/helpers/mappers/testimonial");
    const res = mockedMapTestimonial({
      ctaButton: { label: "Test", color: "secondary" }
    } as any);

    expect(res.button?.variant).toBe("secondary");
  });
});
