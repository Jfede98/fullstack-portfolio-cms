import { render, screen } from "@testing-library/react";
import { ComparativeTable } from "@components/comparativeTable";

const ComparativeTableUIMock: any = jest.fn(() => (
  <div data-testid="comparative-table-ui" />
));

const innerMostFn = jest.fn();
const sectionIndexFn = jest.fn(() => innerMostFn);
const handlerButtonMock = jest.fn((button: unknown, section: unknown) =>
  sectionIndexFn
);

jest.mock("@sitio-publico/shared-ui", () => ({
  ComparativeTable: (props: any) => ComparativeTableUIMock(props),
  Constants: {
    Screen: {
      lg: 992
    }
  }
}));

jest.mock("@hooks/useComparativeTable", () => ({
  useComparativeTable: jest.fn(() => ({
    handlerButton: handlerButtonMock
  }))
}));

jest.mock("@hooks/useCustomPathname", () => ({
  useCustomPathname: () => "home"
}));

describe("ComparativeTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    handlerButtonMock.mockClear();
    sectionIndexFn.mockClear();
    innerMostFn.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders ComparativeTableUI with complete data", () => {
    render(
      <ComparativeTable
        title={{ text: "Compara nuestros planes", tag: "h2" }}
        subtitle={{ text: "Elige el mejor para ti", tag: "h3" }}
        comparative={[
          { label: "Instalación", description: "Instalación gratuita" },
          { label: "Soporte 24/7", description: "Atención permanente" }
        ]}
        sections={[
          {
            label: "Plan 400 mb",
            plan: {
              price: 25.99,
              prevPrice: 30,
              buttons: [
                {
                  children: "Contratar",
                  href: "/contratar",
                  type: "button",
                  color: "primary"
                }
              ]
            },
            active: [true, false]
          }
        ]}
      />
    );

    expect(screen.getByTestId("comparative-table-ui")).toBeInTheDocument();

    const mockCallProps = ComparativeTableUIMock.mock.calls[0][0];

    expect(mockCallProps.title).toEqual({
      tag: "h2",
      variant: "h2",
      type: "regular",
      children: "Compara nuestros planes"
    });
    expect(mockCallProps.subtitle).toEqual({
      tag: "h3",
      variant: "body",
      type: "regular",
      children: "Elige el mejor para ti"
    });
    expect(mockCallProps.comparative).toEqual([
      { label: "Instalación", description: "Instalación gratuita" },
      { label: "Soporte 24/7", description: "Atención permanente" }
    ]);
    expect(mockCallProps.matchMediaBreakpoint).toBe(992);
    expect(mockCallProps.sections).toHaveLength(1);
    expect(mockCallProps.sections[0].label).toBe("Plan 400 mb");
    expect(mockCallProps.sections[0].plan.price).toBe(25.99);
    expect(typeof mockCallProps.sections[0].plan.buttons[0].onClick).toBe("function");
  });

  it("transforms title with default tag when tag is missing", () => {
    ComparativeTableUIMock.mockClear();

    render(
      <ComparativeTable
        title={{ text: "Título sin tag" }}
        sections={[
          {
            label: "Plan A",
            plan: { price: 10 },
            active: [true]
          }
        ]}
      />
    );

    expect(ComparativeTableUIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: {
          tag: "h2",
          variant: "h2",
          type: "regular",
          children: "Título sin tag"
        }
      })
    );
  });

  it("transforms subtitle with default tag when tag is missing", () => {
    ComparativeTableUIMock.mockClear();

    render(
      <ComparativeTable
        subtitle={{ text: "Subtítulo sin tag" }}
        sections={[
          {
            label: "Plan B",
            plan: { price: 20 },
            active: [false]
          }
        ]}
      />
    );

    expect(ComparativeTableUIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        subtitle: {
          tag: "h3",
          variant: "body",
          type: "regular",
          children: "Subtítulo sin tag"
        }
      })
    );
  });

  it("handles missing title and subtitle", () => {
    ComparativeTableUIMock.mockClear();

    render(
      <ComparativeTable
        sections={[
          {
            label: "Plan C",
            plan: { price: 15 },
            active: []
          }
        ]}
      />
    );

    expect(ComparativeTableUIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: undefined,
        subtitle: undefined
      })
    );
  });

  it("passes comparative and sections as provided", () => {
    ComparativeTableUIMock.mockClear();

    const comparative = [
      { label: "Feature 1", description: "Desc 1" },
      { label: "Feature 2", description: "Desc 2" },
      { label: "Feature 3" }
    ];

    const sections = [
      {
        label: "Básico",
        plan: {
          price: 10,
          prevPrice: 15,
          buttons: [{ children: "Comprar", type: "button" as const }]
        },
        active: [true, false, false]
      },
      {
        label: "Premium",
        plan: {
          price: 25,
          prevPrice: 30,
          buttons: [{ children: "Comprar Premium", type: "button" as const }]
        },
        active: [true, true, true]
      }
    ];

    render(<ComparativeTable comparative={comparative} sections={sections} />);

    const mockCallProps = ComparativeTableUIMock.mock.calls[0][0];

    expect(mockCallProps.comparative).toEqual(comparative);
    expect(mockCallProps.sections).toHaveLength(2);
    expect(mockCallProps.sections[0].label).toBe("Básico");
    expect(mockCallProps.sections[0].plan.price).toBe(10);
    expect(typeof mockCallProps.sections[0].plan.buttons[0].onClick).toBe("function");
    expect(mockCallProps.sections[1].label).toBe("Premium");
    expect(mockCallProps.sections[1].plan.price).toBe(25);
    expect(typeof mockCallProps.sections[1].plan.buttons[0].onClick).toBe("function");
  });

  it("handles empty comparative and sections", () => {
    ComparativeTableUIMock.mockClear();

    render(<ComparativeTable comparative={[]} sections={[]} />);

    expect(ComparativeTableUIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        comparative: [],
        sections: []
      })
    );
  });

  it("always sets matchMediaBreakpoint to Screen.lg (992)", () => {
    ComparativeTableUIMock.mockClear();

    render(
      <ComparativeTable
        sections={[
          {
            label: "Plan D",
            plan: { price: 30 },
            active: [true, true]
          }
        ]}
      />
    );

    expect(ComparativeTableUIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        matchMediaBreakpoint: 992
      })
    );
  });

  it("renders wrapper div with correct className", () => {
    const { container } = render(
      <ComparativeTable
        sections={[
          {
            label: "Plan E",
            plan: { price: 40 },
            active: []
          }
        ]}
      />
    );

    const wrapperDiv = container.firstChild;
    expect(wrapperDiv).toHaveClass("py-8", "md:py-10", "md:px-18");
  });

  it("handles sections with multiple buttons", () => {
    ComparativeTableUIMock.mockClear();

    render(
      <ComparativeTable
        sections={[
          {
            label: "Plan Multi",
            plan: {
              price: 50,
              prevPrice: 60,
              buttons: [
                { children: "Botón 1", type: "button" as const, color: "primary" as const },
                { children: "Botón 2", type: "link" as const, href: "/link", color: "secondary" as const },
                { children: "Botón 3", type: "button" as const, color: "tertiary" as const }
              ]
            },
            active: [true, false, true, false]
          }
        ]}
      />
    );

    expect(ComparativeTableUIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        sections: [
          expect.objectContaining({
            plan: expect.objectContaining({
              buttons: expect.arrayContaining([
                expect.objectContaining({ children: "Botón 1" }),
                expect.objectContaining({ children: "Botón 2" }),
                expect.objectContaining({ children: "Botón 3" })
              ])
            })
          })
        ]
      })
    );
  });

  it("handles sections without buttons", () => {
    ComparativeTableUIMock.mockClear();

    render(
      <ComparativeTable
        sections={[
          {
            label: "Plan Sin Botones",
            plan: {
              price: 20,
              prevPrice: 25
            },
            active: [true]
          }
        ]}
      />
    );

    expect(ComparativeTableUIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        sections: [
          expect.objectContaining({
            label: "Plan Sin Botones",
            plan: expect.objectContaining({
              price: 20,
              prevPrice: 25
            }),
            active: [true]
          })
        ]
      })
    );

    const callArgs = ComparativeTableUIMock.mock.calls[0][0];
    expect(callArgs.sections[0].plan.buttons).toBeUndefined();
  });

  it("preserves custom tag values from title", () => {
    ComparativeTableUIMock.mockClear();

    render(
      <ComparativeTable
        title={{ text: "Custom Title", tag: "h1" }}
        sections={[
          {
            label: "Plan F",
            plan: { price: 35 },
            active: []
          }
        ]}
      />
    );

    expect(ComparativeTableUIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.objectContaining({
          tag: "h1"
        })
      })
    );
  });

  it("preserves custom tag values from subtitle", () => {
    ComparativeTableUIMock.mockClear();

    render(
      <ComparativeTable
        subtitle={{ text: "Custom Subtitle", tag: "p" }}
        sections={[
          {
            label: "Plan G",
            plan: { price: 45 },
            active: []
          }
        ]}
      />
    );

    expect(ComparativeTableUIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        subtitle: expect.objectContaining({
          tag: "p"
        })
      })
    );
  });

  it("defaults identifier to 2 when missing in buttons", () => {
    handlerButtonMock.mockClear();
    sectionIndexFn.mockClear();

    render(
      <ComparativeTable
        sections={[
          {
            label: "Plan Test",
            plan: {
              price: 10,
              buttons: [{ children: "Comprar" }]
            },
            active: []
          }
        ]}
      />
    );

    expect(handlerButtonMock).toHaveBeenCalledWith(
      expect.objectContaining({ children: "Comprar" }),
      expect.objectContaining({ label: "Plan Test" })
    );
  });

  it("uses provided identifier for buttons", () => {
    handlerButtonMock.mockClear();
    sectionIndexFn.mockClear();

    render(
      <ComparativeTable
        sections={[
          {
            label: "Plan Test",
            plan: {
              price: 20,
              buttons: [{ children: "Contratar", identifier: 1 }]
            },
            active: []
          }
        ]}
      />
    );

    expect(handlerButtonMock).toHaveBeenCalledWith(
      expect.objectContaining({ children: "Contratar", identifier: 1 }),
      expect.objectContaining({ label: "Plan Test" })
    );
  });

  it("passes titleTable to ComparativeTableUI when provided", () => {
    ComparativeTableUIMock.mockClear();

    render(
      <ComparativeTable
        titleTable={{ text: "Características", tag: "span" }}
        sections={[
          {
            label: "Plan H",
            plan: { price: 15 },
            active: []
          }
        ]}
      />
    );

    expect(ComparativeTableUIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        titleTable: {
          tag: "span",
          variant: "h2",
          type: "regular",
          children: "Características"
        }
      })
    );
  });

  it("passes titleTable as undefined when not provided", () => {
    ComparativeTableUIMock.mockClear();

    render(
      <ComparativeTable
        sections={[
          {
            label: "Plan I",
            plan: { price: 15 },
            active: []
          }
        ]}
      />
    );

    expect(ComparativeTableUIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        titleTable: undefined
      })
    );
  });

  it("uses default tag span when titleTable tag is missing", () => {
    ComparativeTableUIMock.mockClear();

    render(
      <ComparativeTable
        titleTable={{ text: "Planes" }}
        sections={[
          {
            label: "Plan J",
            plan: { price: 20 },
            active: []
          }
        ]}
      />
    );

    expect(ComparativeTableUIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        titleTable: expect.objectContaining({
          tag: "span",
          children: "Planes"
        })
      })
    );
  });
});
