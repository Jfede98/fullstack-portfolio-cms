import { render } from "@testing-library/react";
import { FormBlock } from "@components/forms/contact/block";

const ContactFormMock: any = jest.fn(() => null);
const useContactFormBlockMock = jest.fn();

jest.mock("@components/forms/contact", () => ({
  ContactForm: (props: any) => ContactFormMock(props)
}));

jest.mock("@hooks/client/useContactFormBlock", () => ({
  useContactFormBlock: (props: any) => useContactFormBlockMock(props)
}));

describe("FormBlock", () => {
  beforeEach(() => {
    ContactFormMock.mockClear();
    useContactFormBlockMock.mockReset();
  });

  it("maps to column layout when any input has column", () => {
    useContactFormBlockMock.mockReturnValue({
      contactProps: {
        inputs: [{ name: "a", type: "text", column: "left" }],
        variant: "default"
      }
    });

    render(<FormBlock />);
    expect(ContactFormMock).toHaveBeenCalledWith(
      expect.objectContaining({ variant: "columnLayout", isBlock: true })
    );
  });

  it("preserves semiautomatic variants", () => {
    useContactFormBlockMock.mockReturnValue({
      contactProps: {
        inputs: [{ name: "a", type: "text" }],
        variant: "semiautomatic-flow"
      }
    });

    render(<FormBlock />);
    expect(ContactFormMock).toHaveBeenCalledWith(
      expect.objectContaining({ variant: "semiautomatic-flow", isBlock: true })
    );
  });

  it("forces dsa variant", () => {
    useContactFormBlockMock.mockReturnValue({
      contactProps: {
        inputs: [{ name: "a", type: "text" }],
        variant: "dsa"
      }
    });

    render(<FormBlock />);
    expect(ContactFormMock).toHaveBeenCalledWith(
      expect.objectContaining({ variant: "dsa", isBlock: true })
    );
  });
});
