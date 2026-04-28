import { render, screen } from "@testing-library/react";
import { ServiceChannels } from "@components/serviceChannels";

const ShortcutsMock: any = jest.fn(() => <div data-testid="shortcuts" />);
const CardMock: any = jest.fn(() => <div data-testid="card" />);

jest.mock("@sitio-publico/shared-ui", () => ({
  Shortcuts: (props: any) => ShortcutsMock(props),
  Typography: ({ text }: { text: string }) => <div>{text}</div>
}));

jest.mock("@components/client/ClientAttentionCard", () => ({
  ClientAttentionCard: (props: any) => CardMock(props)
}));

describe("ServiceChannels", () => {
  it("renders cards and shortcuts when data is present", () => {
    render(
      <ServiceChannels
        title={{ text: "Canales", tag: "h2" }}
        channels={[
          {
            title: "Soporte",
            text: "24/7",
            icon: "phone",
            button: { label: "Llamar" }
          }
        ]}
        widget={
          {
            widget: [
              {
                __component: "block.shortcuts",
                items: [{ label: "Pago", icon: { name: "card" }, href: "/pay" }]
              }
            ]
          } as any
        }
      />
    );

    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByTestId("shortcuts")).toBeInTheDocument();
    expect(ShortcutsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        items: [{ title: "Pago", icon: "card", href: "/pay" }]
      })
    );
  });

  it("defaults card icon and button label when missing", () => {
    CardMock.mockClear();
    render(
      <ServiceChannels
        channels={[
          {
            icon: undefined,
            button: undefined
          }
        ]}
      />
    );

    expect(CardMock).toHaveBeenCalledWith(
      expect.objectContaining({
        iconName: "phone",
        title: "",
        text: "",
        button: expect.objectContaining({
          children: "Contactar"
        })
      })
    );
  });

  it("handles undefined channels gracefully", () => {
    const { container, queryByTestId } = render(<ServiceChannels />);
    expect(queryByTestId("card")).toBeNull();
  });

  it("renders title without cards or shortcuts", () => {
    const { queryByTestId } = render(
      <ServiceChannels title={{ text: "Canales", tag: "h2" }} channels={[]} />
    );

    expect(queryByTestId("card")).toBeNull();
    expect(queryByTestId("shortcuts")).toBeNull();
  });

  it("does not render shortcuts when widget is missing", () => {
    ShortcutsMock.mockClear();
    const { queryByTestId } = render(
      <ServiceChannels title={{ text: "Canales", tag: "h2" }} channels={[]} />
    );

    expect(queryByTestId("shortcuts")).toBeNull();
    expect(ShortcutsMock).not.toHaveBeenCalled();
  });

  it("skips title, cards, and shortcuts when data is empty", () => {
    const { container, queryByTestId } = render(
      <ServiceChannels channels={[]} widget={{ widget: [] } as any} />
    );

    expect(container.querySelector("h2")).toBeNull();
    expect(queryByTestId("card")).toBeNull();
    expect(queryByTestId("shortcuts")).toBeNull();
  });

  it("defaults shortcut icon and href when missing", () => {
    ShortcutsMock.mockClear();
    render(
      <ServiceChannels
        channels={[]}
        widget={
          {
            widget: [
              {
                __component: "block.shortcuts",
                items: [{}]
              }
            ]
          } as any
        }
      />
    );
    expect(ShortcutsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        items: [{ title: "", icon: "home", href: "#" }]
      })
    );
  });
});
