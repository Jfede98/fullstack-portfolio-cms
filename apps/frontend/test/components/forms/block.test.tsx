import { render } from "@testing-library/react";
import { FormBlock } from "@components/forms/contact/block";

const ContactFormMock: any = jest.fn(() => <div data-testid="contact-form" />);

jest.mock("@components/forms/contact", () => ({
  ContactForm: (props: any) => ContactFormMock(props)
}));

const useContactFormBlockMock = jest.fn();

jest.mock("@hooks/client/useContactFormBlock", () => ({
  useContactFormBlock: (props: any) => useContactFormBlockMock(props)
}));

describe("FormBlock", () => {
  it("passes contact props to ContactForm", () => {
    useContactFormBlockMock.mockReturnValue({
      contactProps: { title: "Contacto" }
    });

    render(<FormBlock title="Contacto" description="Desc" inputs={[]} />);

    expect(useContactFormBlockMock).toHaveBeenCalled();
    expect(ContactFormMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Contacto",
        isBlock: true
      })
    );
  });
});
