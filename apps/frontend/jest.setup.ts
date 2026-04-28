import React from "react";
import "@testing-library/jest-dom";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    const { src, alt, ...rest } = props as { src?: string; alt?: string };
    return React.createElement("img", { src, alt, ...rest });
  }
}));
