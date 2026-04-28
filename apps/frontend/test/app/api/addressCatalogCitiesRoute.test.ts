import { getCities } from "@lib/api/web/addressCatalog";

jest.mock("@lib/api/web/addressCatalog", () => ({
  getCities: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

const loadRoute = async () =>
  import("../../../src/app/api/address-catalog/cities/route");

describe("address-catalog cities route", () => {
  const getCitiesMock = jest.mocked(getCities);

  beforeEach(() => {
    getCitiesMock.mockReset();
  });

  it("prioritizes configured cities and keeps the rest in original order", async () => {
    const { GET } = await loadRoute();
    getCitiesMock.mockResolvedValueOnce([
      "Manta",
      "Azogues",
      "Loja",
      "Guayaquil",
      "Quito",
      "Machala",
      "Cuenca",
      "Santo Domingo",
      "Ibarra",
    ]);

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: [
        "Quito",
        "Guayaquil",
        "Cuenca",
        "Azogues",
        "Santo Domingo",
        "Manta",
        "Loja",
        "Machala",
        "Ibarra",
      ],
    });
  });

  it("returns empty data with 500 when cities request fails", async () => {
    const { GET } = await loadRoute();
    getCitiesMock.mockRejectedValueOnce(new Error("network"));

    const response = await GET();

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ data: [] });
  });
});
