import { mapMap } from "@lib/helpers/mappers/map";

describe("mapMap", () => {
  it("maps provider and token correctly", () => {
    const result = mapMap({ provider: "mapbox", token: "pk.test_token" });

    expect(result).toEqual({
      provider: "mapbox",
      token: "pk.test_token"
    });
  });

  it("maps google provider and token correctly", () => {
    const result = mapMap({ provider: "google", token: "AIzaSy.test_key" });

    expect(result).toEqual({
      provider: "google",
      token: "AIzaSy.test_key"
    });
  });

  it("sets provider to undefined when provider is missing", () => {
    const result = mapMap({ provider: undefined as any, token: "pk.test_token" });

    expect(result.provider).toBeUndefined();
  });

  it("sets token to undefined when token is missing", () => {
    const result = mapMap({
      provider: "mapbox",
      token: undefined as any
    });

    expect(result.token).toBeUndefined();
  });

  it("handles fully empty data object", () => {
    const result = mapMap({} as any);

    expect(result.provider).toBeUndefined();
    expect(result.token).toBeUndefined();
  });
});
