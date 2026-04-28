import { extractQueryParams, generateLinkUtms, getUtmSource } from "@lib/utils/utms";

describe("utms utils", () => {
  it("generates utm links with defaults and origin", () => {
    const url = generateLinkUtms({
      url: "/promo",
      preOrigin: "https://",
      origin: "example.com"
    });
    expect(url).toContain("/promo?");
    expect(url).toContain("utm_source=web");
    expect(url).toContain("utm_medium=web");
    expect(url).toContain("utm_campaign=https%3A%2F%2Fexample.com");
  });

  it("supports additional params and tsource", () => {
    const url = generateLinkUtms({
      url: "/promo?x=1",
      tsource: "src",
      additionalParams: [{ key: "k", value: "v" }]
    });
    expect(url).toContain("tsource=src");
    expect(url).toContain("k=v");
    expect(url).toContain("&utm_source=");
  });

  it("returns empty string when url is missing", () => {
    expect(generateLinkUtms({ url: "" as any })).toBe("");
  });

  it("builds link when url is root and campaign provided", () => {
    const url = generateLinkUtms({
      url: "/",
      utmCampaign: "camp",
      utmContent: "cont"
    });
    expect(url.startsWith("?")).toBe(true);
    expect(url).toContain("utm_campaign=camp");
    expect(url).toContain("utm_content=cont");
  });

  it("extracts repeated params into arrays", () => {
    const res = extractQueryParams("https://x.test?a=1&a=2&a=3&b=3");
    expect(res).toEqual({ a: ["1", "2", "3"], b: "3" });
  });

  it("handles full URLs and missing utmCampaign but present utmContent", () => {
    const url = generateLinkUtms({
      url: "https://example.com/page",
      preOrigin: "https://",
      origin: "test.com",
      utmContent: "only-content"
    });
    expect(url).toContain("https://example.com/page?");
    expect(url).toContain("utm_content=only-content");
    expect(url).not.toContain("utm_campaign=");
  });

  it("reads utm source from window", () => {
    window.history.pushState({}, "", "?utm_source=ads&utm_campaign=camp&utm_medium=cpc");
    const res = getUtmSource();
    expect(res).toEqual({
      utm_source: "ads",
      utm_campaign: "camp",
      utm_medium: "cpc",
      referrer: window.location.href
    });
  });
});
