import { mapIcon } from "@lib/helpers/mappers/icon";

describe("mapIcon", () => {
  it("returns null when name is missing", () => {
    expect(mapIcon(null)).toBeNull();
    expect(mapIcon({} as any)).toBeNull();
  });

  it("maps icon fields with defaults", () => {
    expect(
      mapIcon({ name: "user", type: null, size: null } as any)
    ).toEqual({
      name: "user",
      type: undefined,
      size: undefined
    });
  });
});
