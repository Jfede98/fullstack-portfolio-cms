import { mapTwoColumns } from "@lib/helpers/mappers/twoColumns";
import { isValidElement, type ReactElement } from "react";

const widgetComponentMock = jest.fn<null, [unknown]>(() => null);
const formBlockComponentMock = jest.fn<null, [unknown]>(() => null);

jest.mock("@components/widget", () => ({
  Widget: (props: unknown) => widgetComponentMock(props)
}));

jest.mock("@components/forms/contact/block", () => ({
  FormBlock: (props: unknown) => formBlockComponentMock(props)
}));

describe("mapTwoColumns", () => {
  const baseWidget = {
    id: 1,
    name: "left",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    publishedAt: "2026-01-01T00:00:00.000Z",
    widget: [{ __component: "block.features" as const, id: 100 }]
  };

  const baseTwoColumns = {
    leftContentType: {
      chooseContent: "widget" as const,
      widget: baseWidget
    },
    rightContentType: {
      chooseContent: "widget" as const,
      widget: {
        id: 2,
        name: "right",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
        publishedAt: "2026-01-01T00:00:00.000Z",
        widget: [{ __component: "block.form" as const, id: 200 }]
      }
    }
  };

  it("maps left and right widget content", () => {
    const result = mapTwoColumns(baseTwoColumns);

    expect(isValidElement(result.leftContent)).toBe(true);
    expect(isValidElement(result.rightContent)).toBe(true);
    expect((result.leftContent as ReactElement)?.props).toEqual(
      expect.objectContaining({ id: 1, name: "left" })
    );
    expect((result.rightContent as ReactElement)?.props).toEqual(
      expect.objectContaining({ id: 2, name: "right" })
    );
    expect((result.leftContent as ReactElement)?.key).toContain("two-columns-left-widget");
    expect((result.rightContent as ReactElement)?.key).toContain("two-columns-right-widget");
    expect(result.backgroundVariant).toBeUndefined();
    expect(result.showDivider).toBeUndefined();
    expect(result.dividerColor).toBeUndefined();
    expect(result.leftWidth).toBeUndefined();
    expect(result.rightWidth).toBeUndefined();
  });

  it("maps lead_form content into FormBlock", () => {
    const result = mapTwoColumns({
      leftContentType: {
        chooseContent: "lead_form",
        lead_form: {
          id: 9,
          documentId: "lead-01",
          name: "Lead Principal",
          channel: "web",
          form: {
            id: 11,
            title: "Solicita cobertura",
            description: "Completa tus datos",
            inputs: [],
            button: { label: "Enviar", identifier: "simple" }
          },
          lead_routing_configs: [
            {
              id: 99,
              documentId: "route-01",
              distributionMode: "email",
              isActive: true
            }
          ]
        }
      },
      rightContentType: {
        chooseContent: "widget",
        widget: baseWidget
      }
    });

    expect(isValidElement(result.leftContent)).toBe(true);
    expect((result.leftContent as ReactElement)?.props).toEqual(
      expect.objectContaining({
        title: "Solicita cobertura",
        leadSelection: expect.objectContaining({
          leadFormDocumentId: "lead-01",
          routingConfigDocumentId: "route-01",
          distributionMode: "email"
        })
      })
    );
    expect((result.leftContent as ReactElement)?.key).toContain("two-columns-left-lead-form");
  });

  it("keeps backward compatibility with legacy left/right widgets", () => {
    const result = mapTwoColumns({
      leftWidget: baseWidget,
      rightWidget: {
        id: 2,
        name: "right",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
        publishedAt: "2026-01-01T00:00:00.000Z",
        widget: [{ __component: "block.form" as const, id: 200 }]
      }
    });

    expect(isValidElement(result.leftContent)).toBe(true);
    expect(isValidElement(result.rightContent)).toBe(true);
  });

  it("returns undefined content when chooseContent is widget but widget is missing", () => {
    const result = mapTwoColumns({
      leftWidget: baseWidget,
      leftContentType: {
        chooseContent: "widget"
      }
    });

    expect(result.leftContent).toBeUndefined();
  });

  it("falls back to legacy widget when chooseContent is lead_form but form is missing", () => {
    const result = mapTwoColumns({
      leftWidget: baseWidget,
      leftContentType: {
        chooseContent: "lead_form",
        lead_form: {
          id: 10,
          documentId: "lead-no-form",
          name: "Lead sin formulario",
          channel: "web"
        }
      }
    });

    expect(isValidElement(result.leftContent)).toBe(true);
    expect((result.leftContent as ReactElement)?.props).toEqual(
      expect.objectContaining({ id: 1, name: "left" })
    );
  });

  it("maps lead_form with undefined leadSelection when documentId is missing", () => {
    const result = mapTwoColumns({
      leftContentType: {
        chooseContent: "lead_form",
        lead_form: {
          id: 9,
          name: "Lead sin docId",
          channel: "web",
          form: {
            id: 11,
            title: "Solicita cobertura",
            description: "Completa tus datos",
            inputs: [],
            button: { label: "Enviar", identifier: "simple" }
          }
        }
      }
    });

    expect(isValidElement(result.leftContent)).toBe(true);
    expect((result.leftContent as ReactElement)?.props).toEqual(
      expect.objectContaining({
        title: "Solicita cobertura",
        leadSelection: undefined
      })
    );
    expect((result.leftContent as ReactElement)?.key).toContain("lead-form-na");
  });

  it("prioritizes the first active routing config and falls back to first item when none active", () => {
    const withActive = mapTwoColumns({
      leftContentType: {
        chooseContent: "lead_form",
        lead_form: {
          id: 9,
          documentId: "lead-routing",
          name: "Lead Routing",
          channel: "web",
          form: {
            id: 11,
            title: "Solicita cobertura",
            description: "Completa tus datos",
            inputs: [],
            button: { label: "Enviar", identifier: "simple" }
          },
          lead_routing_configs: [
            {
              id: 1,
              documentId: "route-inactive",
              distributionMode: "email",
              isActive: false
            },
            {
              id: 2,
              documentId: "route-active",
              distributionMode: "tom",
              isActive: true
            }
          ]
        }
      }
    });

    expect((withActive.leftContent as ReactElement<any>)?.props.leadSelection).toEqual(
      expect.objectContaining({
        routingConfigDocumentId: "route-active",
        distributionMode: "tom"
      })
    );

    const withNoActive = mapTwoColumns({
      leftContentType: {
        chooseContent: "lead_form",
        lead_form: {
          id: 9,
          documentId: "lead-routing-fallback",
          name: "Lead Routing Fallback",
          channel: "web",
          form: {
            id: 11,
            title: "Solicita cobertura",
            description: "Completa tus datos",
            inputs: [],
            button: { label: "Enviar", identifier: "simple" }
          },
          lead_routing_configs: [
            {
              id: 1,
              documentId: "route-first-inactive",
              distributionMode: "both",
              isActive: false
            },
            {
              id: 2,
              documentId: "route-second-inactive",
              distributionMode: "tom",
              isActive: false
            }
          ]
        }
      }
    });

    expect((withNoActive.leftContent as ReactElement<any>)?.props.leadSelection).toEqual(
      expect.objectContaining({
        routingConfigDocumentId: "route-first-inactive",
        distributionMode: "both"
      })
    );
  });

  it("maps only valid supported background values", () => {
    expect(
      mapTwoColumns({ ...baseTwoColumns, backgroundVariant: "white" }).backgroundVariant
    ).toBe("white");
    expect(
      mapTwoColumns({ ...baseTwoColumns, backgroundVariant: "primary-50" }).backgroundVariant
    ).toBe("primary-50");
    expect(
      mapTwoColumns({ ...baseTwoColumns, backgroundVariant: "purple-999" }).backgroundVariant
    ).toBeUndefined();
  });

  it("maps layout customization fields from rule width", () => {
    const result = mapTwoColumns({
      ...baseTwoColumns,
      showDivider: true,
      dividerColor: " #B7B7B9 ",
      leftContentType: {
        ...baseTwoColumns.leftContentType,
        width: " 30% "
      },
      rightContentType: {
        ...baseTwoColumns.rightContentType,
        width: " 40% "
      }
    });

    expect(result.showDivider).toBe(true);
    expect(result.dividerColor).toBe("#B7B7B9");
    expect(result.leftWidth).toBe("30%");
    expect(result.rightWidth).toBe("40%");
  });

  it("uses legacy width fields when rule widths are not present", () => {
    const result = mapTwoColumns({
      ...baseTwoColumns,
      leftWidth: "35",
      rightWidth: "45"
    });

    expect(result.leftWidth).toBe("35%");
    expect(result.rightWidth).toBe("45%");
  });

  it("uses rule widget when chooseContent is empty and supports missing widget id key", () => {
    const result = mapTwoColumns({
      leftContentType: {
        widget: {
          ...baseWidget,
          id: undefined
        } as unknown as typeof baseWidget
      }
    });

    expect(isValidElement(result.leftContent)).toBe(true);
    expect((result.leftContent as ReactElement)?.props).toEqual(
      expect.objectContaining({ name: "left", id: undefined })
    );
    expect((result.leftContent as ReactElement)?.key).toContain("widget-na");
  });

  it("normalizes numeric widths from strapi into percentages", () => {
    const result = mapTwoColumns({
      ...baseTwoColumns,
      leftContentType: {
        ...baseTwoColumns.leftContentType,
        width: "30"
      },
      rightContentType: {
        ...baseTwoColumns.rightContentType,
        width: "40"
      }
    });

    expect(result.leftWidth).toBe("30%");
    expect(result.rightWidth).toBe("40%");
  });

  it("ignores invalid width values and divider colors", () => {
    const result = mapTwoColumns({
      ...baseTwoColumns,
      dividerColor: "not-a-color",
      leftContentType: {
        ...baseTwoColumns.leftContentType,
        width: "50/50"
      },
      rightContentType: {
        ...baseTwoColumns.rightContentType,
        width: "auto"
      }
    });

    expect(result.dividerColor).toBeUndefined();
    expect(result.leftWidth).toBeUndefined();
    expect(result.rightWidth).toBeUndefined();
  });
});
