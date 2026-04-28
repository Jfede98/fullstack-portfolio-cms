import { render, screen } from "@testing-library/react";
import Error from "../../src/app/error";

describe("Error page", () => {
  it("renders error message", () => {
    render(<Error />);
    expect(screen.getByText("Error")).toBeInTheDocument();
  });
});
