import { selectCurrentRoutingConfig } from "@lib/helpers/routingConfig";

describe("routingConfig helper", () => {
  it("returns undefined for empty or null lists", () => {
    expect(selectCurrentRoutingConfig(null)).toBeUndefined();
    expect(selectCurrentRoutingConfig([])).toBeUndefined();
    expect(selectCurrentRoutingConfig([null, undefined])).toBeUndefined();
  });

  it("returns active item sorted by id when active items exist", () => {
    const configs = [
      { id: 10, isActive: false },
      { id: 5, isActive: true },
      { id: 2, isActive: true }
    ];
    expect(selectCurrentRoutingConfig(configs)).toEqual({ id: 2, isActive: true });
  });

  it("returns inactive item sorted by id when no active items exist", () => {
    const configs = [
      { id: 10, isActive: false },
      { id: 5, isActive: false },
      { isActive: false } // no id
    ];
    // id 5 should win because it is lowest valid id, then 10, then no-id (MAX_SAFE_INTEGER)
    expect(selectCurrentRoutingConfig(configs)).toEqual({ id: 5, isActive: false });
  });

  it("handles missing ids properly during sort", () => {
    const configs = [
      { isActive: true },
      { id: 1, isActive: true }
    ];
    expect(selectCurrentRoutingConfig(configs)).toEqual({ id: 1, isActive: true });
  });
});
