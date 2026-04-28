import { render } from "@testing-library/react";
import { ClientWhatsApp } from "@components/client/ClientWhatsApp";
import type { IWhatsAppProps } from "@sitio-publico/shared-ui";

const WhatsAppMock: any = jest.fn(() => <div data-testid="wa" />);

jest.mock("@sitio-publico/shared-ui", () => ({
  WhatsApp: (props: IWhatsAppProps) => WhatsAppMock(props)
}));

describe("ClientWhatsApp", () => {
  it("passes className to WhatsApp", () => {
    render(<ClientWhatsApp phoneNumber="099" text={""} />);

    expect(WhatsAppMock).toHaveBeenCalledWith(
      expect.objectContaining({
        phoneNumber: "099",
        className: expect.any(Object)
      })
    );
  });
});
