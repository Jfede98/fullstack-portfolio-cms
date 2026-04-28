import { mapCspPolicies } from "@lib/helpers/mappers/csp";

describe("mapCspPolicies", () => {
  it("replaces nonce placeholders and maps values by key", () => {
    const policies = [
      { key: "script-src", value: ["'self'"] },
      { key: "img-src", value: ["'self'"] }
    ];
    const csp = {
      "script-src": ["'self'", "{nonce}", "https://example.com"]
    };

    const result = mapCspPolicies(policies, csp, "abc123");

    expect(result).toEqual([
      {
        key: "script-src",
        value: ["'self'", "'nonce-abc123'", "https://example.com"]
      },
      { key: "img-src", value: ["'self'"] }
    ]);
  });

  it("keeps original values when key is missing", () => {
    const policies = [{ key: "default-src", value: ["'self'"] }];
    const csp = {};

    const result = mapCspPolicies(policies, csp, "nonce");

    expect(result).toEqual([{ key: "default-src", value: ["'self'"] }]);
  });
});
