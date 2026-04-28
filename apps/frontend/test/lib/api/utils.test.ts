const notFoundMock = jest.fn();
const errorSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

jest.mock("next/navigation", () => ({
  notFound: () => notFoundMock()
}));

jest.mock("@lib/constants/constants", () => ({
  STAGE: "dev"
}));

describe("fetchingWrapperError", () => {
  afterEach(() => {
    notFoundMock.mockReset();
    errorSpy.mockClear();
  });

  it("returns callback response", async () => {
    const { fetchingWrapperError } = await import("@lib/api/utils");
    const result = await fetchingWrapperError({
      callback: async () => "ok"
    });
    expect(result).toBe("ok");
  });

  it("logs and returns undefined when callback throws", async () => {
    const { fetchingWrapperError } = await import("@lib/api/utils");
    const result = await fetchingWrapperError({
      callback: async () => {
        throw new Error("boom");
      },
      errorMessage: "unit"
    });
    expect(result).toBeUndefined();
    expect(errorSpy).toHaveBeenCalled();
  });

  it("throws when isThrowError is true", async () => {
    const { fetchingWrapperError } = await import("@lib/api/utils");
    await expect(
      fetchingWrapperError({
        callback: async () => {
          throw new Error("boom");
        },
        errorMessage: "unit",
        isThrowError: true
      })
    ).rejects.toThrow("boom");
  });

  it("calls notFound when isNotFound is true", async () => {
    const { fetchingWrapperError } = await import("@lib/api/utils");
    const result = await fetchingWrapperError({
      callback: async () => {
        throw new Error("boom");
      },
      errorMessage: "unit",
      isNotFound: true
    });
    expect(result).toBeUndefined();
    expect(notFoundMock).toHaveBeenCalled();
  });
});
