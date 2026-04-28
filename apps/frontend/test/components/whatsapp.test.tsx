import { render } from "@testing-library/react";
import { WhatsApp } from "@components/whatsapp";

const getGlobal = jest.fn();
const mapWhatsApp = jest.fn();
const ClientWhatsAppMock: any = jest.fn(() => <div data-testid="client-wa" />);

jest.mock("@lib/api/web/global", () => ({
  getGlobal: () => getGlobal()
}));

jest.mock("@lib/helpers/mappers/whatsapp", () => ({
  mapWhatsApp: (arg: any) => mapWhatsApp(arg)
}));

jest.mock("@components/client/ClientWhatsApp", () => ({
  ClientWhatsApp: (props: any) => ClientWhatsAppMock(props)
}));

describe("WhatsApp server component", () => {
  it("returns null when mapper returns null", async () => {
    getGlobal.mockResolvedValue({});
    mapWhatsApp.mockReturnValue(null);

    const result = await WhatsApp();
    expect(result).toBeNull();
  });

  it("renders ClientWhatsApp when mapper returns props", async () => {
    getGlobal.mockResolvedValue({ data: "x" });
    mapWhatsApp.mockReturnValue({ phone: "099" });

    const result = await WhatsApp();
    render(<div>{result as any}</div>);

    expect(ClientWhatsAppMock).toHaveBeenCalledWith(
      expect.objectContaining({ phone: "099" })
    );
  });
});
