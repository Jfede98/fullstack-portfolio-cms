import { render } from "@testing-library/react";
import { CtaBanner } from "@components/ctaBanner";

const CTABenefitsMock: any = jest.fn(() => <div data-testid="cta" />);
const handlerCtaButton = jest.fn();
const normalizeCtaBannerFeatures = jest.fn(() => [
  { iconName: "wifi", text: "Rapido" }
]);

jest.mock("@sitio-publico/shared-ui", () => ({
  CTABenefits: (props: any) => CTABenefitsMock(props)
}));

jest.mock("@hooks/useCtaBanner", () => ({
  useCtaBanner: () => ({
    handlerCtaButton,
    normalizeCtaBannerFeatures
  })
}));

describe("CtaBanner", () => {
  it("passes normalized features and handler to CTABenefits", () => {
    render(
      <CtaBanner
        title={{ text: "Titulo", tag: "h2" }}
        subtitle="Sub"
        backgroundImage="bg.jpg"
        features={[{ iconName: "wifi", text: "Rapido" }]}
        button={{ children: "Ver" }}
      />
    );

    expect(normalizeCtaBannerFeatures).toHaveBeenCalled();
    expect(CTABenefitsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: { text: "Titulo", tag: "h2" },
        subtitle: "Sub",
        backgroundImage: "bg.jpg",
        features: [{ iconName: "wifi", text: "Rapido" }],
        button: expect.objectContaining({
          children: "Ver",
          onClick: undefined
        })
      })
    );
  });

  it("falls back to empty strings when title or subtitle are missing", () => {
    CTABenefitsMock.mockClear();
    normalizeCtaBannerFeatures.mockReturnValueOnce([]);

    render(<CtaBanner />);

    expect(CTABenefitsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: { text: "" },
        subtitle: "",
        features: []
      })
    );
  });

  it("sets onClick wrapper when button identifier is modal", () => {
    CTABenefitsMock.mockClear();
    render(
      <CtaBanner
        title={{ text: "Titulo", tag: "h2" }}
        button={{
          children: "Abrir",
          identifier: 0,
          leadFormSelection: { leadFormDocumentId: "doc-1" }
        } as any}
      />
    );

    const props = CTABenefitsMock.mock.calls[0][0];
    expect(typeof props.button.onClick).toBe("function");
    expect(props.button).not.toHaveProperty("leadFormSelection");
    props.button.onClick();
    expect(handlerCtaButton).toHaveBeenCalledWith(
      expect.objectContaining({ identifier: 0 })
    );
  });
});
