import { ValidationError } from "yup";

jest.mock("@sitio-publico/shared-ui", () => ({
  useMatchMedia: () => ({ isDesktop: true })
}));

jest.mock("@hooks/useCustomPathname", () => ({
  useCustomPathname: () => "home"
}));

jest.mock("@hooks/useGtm", () => ({
  useGtm: () => ({ addEvent: jest.fn() })
}));

import { mapValidationErrors } from "@hooks/providers/useContactForm";

describe("mapValidationErrors", () => {
  it("maps nested yup errors from inner array", () => {
    const error = new ValidationError("invalid");
    (error as any).inner = [
      { path: "phone", message: "invalid phone" },
      { path: "document", message: "invalid doc" },
      { path: undefined, message: "skip" }
    ];

    expect(mapValidationErrors(error)).toEqual({
      phone: "invalid phone",
      document: "invalid doc"
    });
  });

  it("maps single yup error by path", () => {
    const error = new ValidationError("single");
    (error as any).path = "phone";
    (error as any).inner = [];

    expect(mapValidationErrors(error)).toEqual({
      phone: "single"
    });
  });

  it("returns empty object when error has no path and no inner", () => {
    const error = new ValidationError("unknown");
    (error as any).path = undefined;
    (error as any).inner = [];

    expect(mapValidationErrors(error)).toEqual({});
  });
});
