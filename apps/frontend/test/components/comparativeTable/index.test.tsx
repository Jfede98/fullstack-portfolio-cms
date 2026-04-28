import { render } from "@testing-library/react";
import { ComparativeTable } from "@components/comparativeTable";

const ComparativeTableUIMock: any = jest.fn(() => <div data-testid="table" />);

jest.mock("@sitio-publico/shared-ui", () => ({
  ComparativeTable: (props: any) => ComparativeTableUIMock(props),
  Constants: { Screen: { lg: 992 } }
}));

jest.mock("@hooks/useComparativeTable", () => ({
  useComparativeTable: jest.fn(() => ({
    handlerButton: jest.fn(() => () => undefined),
    containerRef: { current: null }
  }))
}));

describe("ComparativeTable", () => {
  beforeEach(() => {
    ComparativeTableUIMock.mockClear();
  });

  it("strips leadFormSelection from buttons and attaches handler", () => {
    render(
      <ComparativeTable
        title={{ text: "Title" } as any}
        sections={[
          {
            plan: {
              buttons: [
                {
                  label: "Go",
                  leadFormSelection: { leadFormDocumentId: "x" }
                }
              ]
            }
          }
        ] as any}
      />
    );

    const sections = ComparativeTableUIMock.mock.calls[0][0].sections;
    const button = sections[0].plan.buttons[0];
    expect(button.leadFormSelection).toBeUndefined();
    expect(typeof button.onClick).toBe("function");
  });

  it("passes title, subtitle and titleTable props when provided", () => {
    render(
      <ComparativeTable
        title={{ text: "Title", tag: "h1" } as any}
        subtitle={{ text: "Subtitle" } as any}
        titleTable={{ text: "Table" } as any}
        sections={[] as any}
        comparative={[] as any}
      />
    );

    const props = ComparativeTableUIMock.mock.calls[0][0];
    expect(props.title.children).toBe("Title");
    expect(props.subtitle.children).toBe("Subtitle");
    expect(props.titleTable.children).toBe("Table");
  });

  it("keeps sections without plan untouched", () => {
    render(
      <ComparativeTable
        sections={[{ title: "No plan" } as any]}
        comparative={[] as any}
      />
    );
    const sections = ComparativeTableUIMock.mock.calls[0][0].sections;
    expect(sections[0]).toEqual({ title: "No plan" });
  });
});
