import { render } from "@testing-library/react";
import { Widget } from "@components/widget";
import type { ReactNode } from "react";
import type { TWidget } from "@interfaces/lib/strapi/modules";

const buildSections = jest.fn();

jest.mock("@lib/helpers/buildBlocks", () => ({
  buildSections: (args: unknown) => buildSections(args)
}));

describe("Widget", () => {
  const widgetPayload: TWidget = {
    id: 1,
    name: "test-widget",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    publishedAt: "2026-01-01T00:00:00.000Z",
    widget: [{ __component: "block.hero", id: 10 }]
  };

  it("returns null when buildSections returns undefined", async () => {
    buildSections.mockResolvedValue(undefined);
    const result = await Widget(widgetPayload);
    expect(result).toBeNull();
  });

  it("calls buildSections when widget is present", async () => {
    buildSections.mockResolvedValue(<div data-testid="section" />);
    const result = await Widget({
      id: 2,
      name: "test-widget-2",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      publishedAt: "2026-01-01T00:00:00.000Z",
      widget: [{ __component: "block.hero", id: 20 }]
    });
    render(<div>{result as ReactNode}</div>);

    expect(buildSections).toHaveBeenCalledWith(
      expect.objectContaining({
        section: expect.arrayContaining([
          expect.objectContaining({ __component: "block.hero", id: 20 })
        ])
      })
    );
  });
});
