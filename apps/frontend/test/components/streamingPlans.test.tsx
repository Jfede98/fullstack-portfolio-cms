import { render, screen } from "@testing-library/react";
import { StreamingPlans } from "@components/streamingPlans";

const StreamingPlansUIMock: any = jest.fn(() => (
  <div data-testid="streaming-plans-ui" />
));

const handlerButton = jest.fn(() => jest.fn(() => jest.fn()));

jest.mock("@sitio-publico/shared-ui", () => ({
  StreamingPlans: (props: any) => StreamingPlansUIMock(props)
}));

jest.mock("@hooks/useStreamingPlanCard", () => ({
  useStreamingPlanCard: () => ({ handlerButton })
}));

jest.mock("@hooks/useCustomPathname", () => ({
  useCustomPathname: () => "home"
}));

describe("StreamingPlans", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders with complete data and passes props to UI component", () => {
    render(
      <StreamingPlans
        title={{ text: "Nuestros Planes", tag: "h2" }}
        subtitle={{ text: "Elige tu plan ideal", tag: "p" }}
        plans={[
          {
            title: "Plan Básico",
            description: "Perfecto para empezar",
            image: { src: "", alt: "Plan Básico" },
            ctas: [{ label: "Contratar" }]
          },
          {
            title: "Plan Premium",
            description: "Lo mejor en streaming",
            image: { src: "", alt: "Plan Premium" },
            badgeText: "Recomendado",
            ctas: [{ label: "Ver más" }]
          }
        ]}
      />
    );

    expect(screen.getByTestId("streaming-plans-ui")).toBeInTheDocument();

    const mockCallProps = StreamingPlansUIMock.mock.calls[0][0];

    expect(mockCallProps.title).toEqual({ text: "Nuestros Planes", tag: "h2" });
    expect(mockCallProps.subtitle).toEqual({ text: "Elige tu plan ideal", tag: "p" });
    expect(mockCallProps.layout).toEqual({
      mobile: "grid",
      desktop: "grid"
    });

    expect(mockCallProps.plans).toHaveLength(2);
    expect(mockCallProps.plans[0].title).toBe("Plan Básico");
    expect(typeof mockCallProps.plans[0].ctas[0].onClick).toBe("function");
    expect(mockCallProps.plans[1].title).toBe("Plan Premium");
    expect(typeof mockCallProps.plans[1].ctas[0].onClick).toBe("function");
  });

  it("renders without subtitle", () => {
    StreamingPlansUIMock.mockClear();

    render(
      <StreamingPlans
        title={{ text: "Planes", tag: "h2" }}
        plans={[
          {
            title: "Plan Test",
            description: "Descripción",
            image: { src: "", alt: "Test" },
            ctas: []
          }
        ]}
      />
    );

    expect(StreamingPlansUIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: { text: "Planes", tag: "h2" },
        subtitle: undefined,
        plans: expect.any(Array)
      })
    );
  });

  it("renders with empty plans array", () => {
    StreamingPlansUIMock.mockClear();

    render(
      <StreamingPlans
        title={{ text: "Sin Planes", tag: "h2" }}
        plans={[]}
      />
    );

    expect(StreamingPlansUIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: { text: "Sin Planes", tag: "h2" },
        plans: []
      })
    );
  });

  it("defaults to empty title when title is missing", () => {
    StreamingPlansUIMock.mockClear();

    render(
      <StreamingPlans
        plans={[
          {
            title: "Plan",
            description: "Desc",
            image: { src: "", alt: "" },
            ctas: []
          }
        ]}
      />
    );

    expect(StreamingPlansUIMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: { text: "", tag: "h2" },
        plans: expect.any(Array)
      })
    );
  });

  it("always sets layout to grid for mobile and desktop", () => {
    render(
      <StreamingPlans
        title={{ text: "Planes", tag: "h2" }}
        plans={[]}
      />
    );

    const mockCallProps = StreamingPlansUIMock.mock.calls[0][0];
    expect(mockCallProps.layout).toEqual({
      mobile: "grid",
      desktop: "grid"
    });
  });

  it("defaults identifier to 2 when missing in CTAs", () => {
    render(
      <StreamingPlans
        title={{ text: "Planes", tag: "h2" }}
        plans={[
          {
            title: "Plan Test",
            description: "Test",
            image: { src: "", alt: "" },
            ctas: [{ label: "Contratar" }]
          }
        ]}
      />
    );
    expect(handlerButton).toHaveBeenCalledWith(
      expect.objectContaining({ label: "Contratar" }),
      expect.objectContaining({ title: "Plan Test" })
    );
  });

  it("uses provided identifier for CTAs", () => {
    render(
      <StreamingPlans
        title={{ text: "Planes", tag: "h2" }}
        plans={[
          {
            title: "Plan Test",
            description: "Test",
            image: { src: "", alt: "" },
            ctas: [{ label: "Contratar", identifier: 1 }]
          }
        ]}
      />
    );
    expect(handlerButton).toHaveBeenCalledWith(
      expect.objectContaining({ identifier: 1, label: "Contratar" }),
      expect.objectContaining({ title: "Plan Test" })
    );
  });

  it("removes leadFormSelection from cta props passed to UI", () => {
    StreamingPlansUIMock.mockClear();
    render(
      <StreamingPlans
        title={{ text: "Planes", tag: "h2" }}
        plans={[
          {
            title: "Plan Test",
            description: "Test",
            image: { src: "", alt: "" },
            ctas: [
              {
                label: "Contratar",
                identifier: 0,
                leadFormSelection: { leadFormDocumentId: "doc-1" }
              } as any
            ]
          }
        ]}
      />
    );

    const cta = StreamingPlansUIMock.mock.calls[0][0].plans[0].ctas[0];
    expect(cta).not.toHaveProperty("leadFormSelection");
    expect(typeof cta.onClick).toBe("function");
  });
});
