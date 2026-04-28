import { act, render, renderHook } from "@testing-library/react";
import { usePlanTab } from "@hooks/usePlanTab";

const addEvent = jest.fn();

jest.mock("@hooks/useGtm", () => ({
  useGtm: () => ({ addEvent })
}));

jest.mock("@hooks/useCustomPathname", () => ({
  useCustomPathname: () => "home"
}));

jest.mock("@components/planTabContent", () => ({
  PlanTabContent: jest.fn().mockImplementation((category: any) => ({
    category
  }))
}));

jest.mock("@hooks/useCustomPathname", () => ({
  useCustomPathname: () => "home"
}));

let observerCallback: IntersectionObserverCallback | null = null;
let observedElement: Element | null = null;
const unobserveMock = jest.fn();
const disconnectMock = jest.fn();

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    observerCallback = callback;
  }

  observe = jest.fn((element: Element) => {
    observedElement = element;
  });
  unobserve = unobserveMock;
  disconnect = disconnectMock;
}

beforeAll(() => {
  (global as any).IntersectionObserver = MockIntersectionObserver;
});

describe("usePlanTab", () => {
  beforeEach(() => {
    addEvent.mockClear();
    observerCallback = null;
    observedElement = null;
    unobserveMock.mockClear();
    disconnectMock.mockClear();
  });

  it("builds tabs and normalizes labels", () => {
    const { result } = renderHook(() =>
      usePlanTab({
        categories: [
          {
            id: 1,
            label: "Hogar",
            icon: { name: "home" },
            plans: [
              {
                id: 10,
                name: "Plan A",
                speedUnit: "Mbps",
                priceInfo: { amount: "10*" }
              }
            ]
          },
          { id: 2, label: "Movil" }
        ],
        gridRules: []
      } as any)
    );

    expect(result.current.tabs).toHaveLength(2);
    expect(result.current.activeTitle).toEqual({ text: "Hogar" });
    expect(result.current.tabs[0].label).toBe("Hogar");
  });

  it("normalizes label spaces and handles undefined categories", () => {
    const { result, rerender } = renderHook(
      ({ categories }) =>
        usePlanTab({
          categories,
          gridRules: []
        } as any),
      {
        initialProps: {
          categories: [{ id: 1, label: "  Hogar   Plus  ", plans: [] }]
        }
      }
    );

    expect(result.current.tabs[0].label).toBe("Hogar Plus");

    rerender({ categories: undefined as any });
    expect(result.current.tabs).toEqual([]);
    expect(result.current.activeDescription).toBe("");
    expect(result.current.activeTitle).toBeUndefined();
  });

  it("changes tab and sends view_item + view_item_list events", () => {
    const { result } = renderHook(() =>
      usePlanTab({
        categories: [
          { id: 1, label: "Hogar", plans: [] },
          { id: 2, label: "Movil", plans: [] }
        ],
        gridRules: []
      } as any)
    );

    act(() => {
      result.current.handlerChangeTab(1);
    });

    expect(result.current.activeIndex).toBe(1);
    expect(addEvent).toHaveBeenCalledTimes(2);
    expect(addEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        event: "view_item",
        section: "planes",
        elementDescription: "movil"
      })
    );
    expect(addEvent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        event: "view_item_list",
        section: "lista-planes",
        elementDescription: "movil"
      })
    );
  });

  it("omits icon when category icon is missing", () => {
    const { result } = renderHook(() =>
      usePlanTab({
        categories: [{ id: 1, label: "Hogar", icon: undefined }],
        gridRules: []
      } as any)
    );

    expect(result.current.tabs[0].icon).toBeUndefined();
  });

  it("maps icon when category icon is present", () => {
    const { result } = renderHook(() =>
      usePlanTab({
        categories: [
          {
            id: 1,
            label: "Hogar",
            icon: { name: "home", type: "solid" }
          }
        ],
        gridRules: []
      } as any)
    );

    expect(result.current.tabs[0].icon).toEqual({
      name: "home",
      type: "solid"
    });
  });

  it("uses label when title and description are missing", () => {
    const { result } = renderHook(() =>
      usePlanTab({
        categories: [{ id: 1, label: "Hogar" }],
        gridRules: []
      } as any)
    );

    expect(result.current.activeTitle).toEqual({ text: "Hogar" });
  });

  it("uses title when provided and exposes description", () => {
    const { result } = renderHook(() =>
      usePlanTab({
        categories: [
          { id: 1, label: "Hogar", title: { text: "Titulo" }, description: "Desc" }
        ],
        gridRules: []
      } as any)
    );

    expect(result.current.activeTitle).toEqual({ text: "Titulo" });
    expect(result.current.activeDescription).toBe("Desc");
  });

  it("returns itemListRef for IntersectionObserver integration", () => {
    const { result } = renderHook(() =>
      usePlanTab({
        categories: [{ id: 1, label: "Hogar", plans: [] }],
        gridRules: []
      } as any)
    );

    expect(result.current.itemListRef).toBeDefined();
    expect(result.current.itemListRef.current).toBeNull();
  });

  it("keeps active title undefined when active category has no title or label", () => {
    const { result } = renderHook(() =>
      usePlanTab({
        categories: [{ id: 1, description: "sin label" }],
        gridRules: []
      } as any)
    );

    expect(result.current.activeTitle).toBeUndefined();
    expect(result.current.activeDescription).toBe("sin label");
  });

  it("handles tab change when category index does not exist", () => {
    const { result } = renderHook(() =>
      usePlanTab({
        categories: [{ id: 1, label: "Hogar", plans: [] }],
        gridRules: []
      } as any)
    );

    act(() => {
      result.current.handlerChangeTab(10);
    });

    expect(addEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        event: "view_item",
        elementDescription: ""
      })
    );
    expect(addEvent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        event: "view_item_list",
        elementDescription: ""
      })
    );
  });

  it("observes list ref element and emits list event on intersection", () => {
    const TestComponent = () => {
      const { itemListRef } = usePlanTab({
        categories: [{ id: 1, label: "Hogar", plans: [] }],
        gridRules: []
      } as any);

      return <div ref={itemListRef} data-testid="list-ref" />;
    };

    render(<TestComponent />);
    expect(observedElement).toBeTruthy();

    act(() => {
      observerCallback?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(addEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "view_item_list",
        section: "lista-planes",
        elementDescription: "hogar"
      })
    );
    expect(unobserveMock).toHaveBeenCalled();
  });

  it("ignores intersection events when isIntersecting is false", () => {
    addEvent.mockClear();
    const TestComponent = () => {
      const { itemListRef } = usePlanTab({
        categories: [{ id: 1, label: "Hogar", plans: [] }],
        gridRules: []
      } as any);

      return <div ref={itemListRef} data-testid="list-ref" />;
    };

    render(<TestComponent />);
    expect(observedElement).toBeTruthy();

    act(() => {
      observerCallback?.(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(addEvent).not.toHaveBeenCalled();
  });

  it("handles missing amount and speedUnit in plans safely", () => {
    const { result } = renderHook(() =>
      usePlanTab({
        categories: [
          {
            id: 1,
            label: "Hogar",
            plans: [
              {
                id: 10,
                name: "Plan A",
                speedUnit: undefined,
                priceInfo: { amount: undefined }
              }
            ]
          }
        ],
        gridRules: []
      } as any)
    );

    act(() => {
      result.current.handlerChangeTab(0);
    });

    expect(addEvent).toHaveBeenCalled();
  });

});
