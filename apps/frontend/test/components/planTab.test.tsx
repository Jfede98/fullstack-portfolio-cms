import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { PlanTab } from "@components/planTab";

const TabMock: any = jest.fn(() => <div data-testid="tab" />);
const usePlanTabMock = jest.fn();

jest.mock("@sitio-publico/shared-ui", () => ({
  Tab: (props: any) => TabMock(props),
  Typography: ({ children, text }: { children?: ReactNode; text?: string }) => (
    <div>{children ?? text}</div>
  )
}));

jest.mock("@hooks/usePlanTab", () => ({
  usePlanTab: (args: any) => usePlanTabMock(args)
}));

describe("PlanTab", () => {
  it("renders title, description, and tabs", () => {
    usePlanTabMock.mockReturnValue({
      activeDescription: "Desc",
      activeTitle: { text: "Titulo", tag: "h3" },
      tabs: [{ id: "1", label: "A" }],
      activeIndex: 0,
      handlerChangeTab: jest.fn()
    });

    render(
      <PlanTab
        title={{ text: "Planes", tag: "h2" }}
        description="Info"
        categories={[]}
        gridRules={[]}
      />
    );

    expect(screen.getByText("Planes")).toBeInTheDocument();
    expect(screen.getByText("Info")).toBeInTheDocument();
    expect(screen.getByText("Titulo")).toBeInTheDocument();
    expect(screen.getByText("Desc")).toBeInTheDocument();
    expect(screen.getByTestId("tab")).toBeInTheDocument();
    expect(TabMock).toHaveBeenCalled();
  });

  it("skips title, description, and tabs when empty", () => {
    TabMock.mockClear();
    usePlanTabMock.mockReturnValue({
      activeDescription: "",
      activeTitle: undefined,
      tabs: [],
      activeIndex: 0,
      handlerChangeTab: jest.fn()
    });

    const { container, queryByTestId } = render(
      <PlanTab categories={[]} gridRules={[]} />
    );

    expect(container.querySelector("h2")).toBeNull();
    expect(container.querySelector("h3")).toBeNull();
    expect(queryByTestId("tab")).toBeNull();
  });

  it("handles many tabs and tag fallback", () => {
    TabMock.mockClear();
    usePlanTabMock.mockReturnValue({
      activeDescription: "Desc",
      activeTitle: { text: "Titulo" }, // missing tag covers line 72
      tabs: [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }], // 4 tabs
      activeIndex: 0,
      handlerChangeTab: jest.fn()
    });

    render(
      <PlanTab categories={[]} gridRules={[]} />
    );

    expect(TabMock).toHaveBeenCalled();
  });

  it("handles exactly three tabs", () => {
    TabMock.mockClear();
    usePlanTabMock.mockReturnValue({
      activeDescription: "",
      activeTitle: undefined,
      tabs: [{ id: "1" }, { id: "2" }, { id: "3" }], // 3 tabs
      activeIndex: 0,
      handlerChangeTab: jest.fn()
    });

    render(
      <PlanTab categories={[]} gridRules={[]} showCategoryHeader={false} />
    );

    expect(TabMock).toHaveBeenCalled();
  });
});
