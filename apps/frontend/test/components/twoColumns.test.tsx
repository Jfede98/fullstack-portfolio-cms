import { render, screen } from "@testing-library/react";
import { TwoColumnsBlock } from "@components/twoColumns";
import type { ReactNode } from "react";

type SharedTwoColumnsProps = {
  background?: string;
  showDivider?: boolean;
  dividerColor?: string;
  leftWidth?: string;
  rightWidth?: string;
  left?: ReactNode;
  right?: ReactNode;
};

const sharedTwoColumnsMock = jest.fn(
  ({ background, left, right }: SharedTwoColumnsProps) => (
    <section data-testid="shared-two-columns" data-background={background}>
      <div data-testid="left-column">{left}</div>
      <div data-testid="right-column">{right}</div>
    </section>
  )
);

jest.mock("@shared-ui/components/twoColumns", () => ({
  TwoColumns: (props: SharedTwoColumnsProps) => sharedTwoColumnsMock(props)
}));

describe("TwoColumnsBlock", () => {
  it("renders left and right content with default background", () => {
    render(
      <TwoColumnsBlock
        leftContent={<div data-testid="left-content">left</div>}
        rightContent={<div data-testid="right-content">right</div>}
      />
    );

    expect(screen.getByTestId("shared-two-columns")).toHaveAttribute(
      "data-background",
      "primary-50"
    );
    expect(screen.getByTestId("left-content")).toBeInTheDocument();
    expect(screen.getByTestId("right-content")).toBeInTheDocument();
  });

  it("maps backgroundVariant into shared background", () => {
    render(
      <TwoColumnsBlock
        leftContent={<div>left</div>}
        rightContent={<div>right</div>}
        backgroundVariant="white"
      />
    );

    expect(screen.getByTestId("shared-two-columns")).toHaveAttribute(
      "data-background",
      "white"
    );
  });

  it("passes layout customization props to shared component", () => {
    render(
      <TwoColumnsBlock
        leftContent={<div>left</div>}
        rightContent={<div>right</div>}
        showDivider
        dividerColor="#B7B7B9"
        leftWidth="30%"
        rightWidth="40%"
      />
    );

    expect(sharedTwoColumnsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        showDivider: true,
        dividerColor: "#B7B7B9",
        leftWidth: "30%",
        rightWidth: "40%"
      })
    );
  });

  it("falls back to null when left and right content are missing", () => {
    render(<TwoColumnsBlock />);

    expect(sharedTwoColumnsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        left: null,
        right: null
      })
    );
  });
});
