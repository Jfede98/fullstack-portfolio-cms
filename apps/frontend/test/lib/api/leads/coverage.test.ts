const fetchMock = jest.fn();
global.fetch = fetchMock as unknown as typeof fetch;

const getTokenMock = jest.fn();
jest.mock("@lib/api/leads/tom", () => ({
  getTokenTomGestorLead: () => getTokenMock()
}));

jest.mock("@lib/api/utils", () => ({
  fetchingWrapperError: ({ callback }: { callback: () => unknown }) => callback()
}));

describe("checkCoverageByCoords", () => {
  const COVERAGE_URL = "https://api-gd-dev.xtrim.com.ec";
  const ACCESS_TOKEN = "Bearer test-access-token";

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  const mockCoverageFound = {
    response: true,
    message: "Cobertura consultada correctamente",
    data: {
      code: 0,
      data: {
        city: "GUAYAQUIL",
        province: "GUAYAS",
        sector: "BELLAVISTA",
        subSector: "EL PARAISO",
        nodes: [{ nodeName: "2C1D (HFC)", technology: "HFC", isOverlay: "Y" }]
      }
    }
  };

  const mockCoverageNotFound = {
    response: true,
    message: "Cobertura consultada correctamente",
    data: {
      code: -1,
      externalTransactionId: "ac7e820b-1a76-4ed7-bb4c-62f4e582bb70",
      internalTransactionId: "a85bd432-e944-4698-9243-ede24edfb520",
      message: "No existe cobertura en las coordenadas ingresadas"
    }
  };

  it("throws when TOM_GESTOR_LEADS_OAUTH_URL is not configured", async () => {
    jest.doMock("@lib/constants/constants", () => ({
      TOM_GESTOR_LEADS_OAUTH_URL: "",
      TOM_GESTOR_LEADS_CLIENT_ID: "id",
      TOM_GESTOR_LEADS_CLIENT_SECRET: "secret",
      TOM_GESTOR_LEADS_CLIENT_GRANT_TYPE: "client_credentials"
    }));

    const { checkCoverageByCoords } = await import("@lib/api/leads/coverage");

    await expect(checkCoverageByCoords(-2.170997, -79.922359)).rejects.toThrow(
      "TOM_GESTOR_LEADS_OAUTH_URL is not configured"
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns hasCoverage true when API returns code 0", async () => {
    jest.doMock("@lib/constants/constants", () => ({
      TOM_GESTOR_LEADS_OAUTH_URL: COVERAGE_URL,
      TOM_GESTOR_LEADS_CLIENT_ID: "id",
      TOM_GESTOR_LEADS_CLIENT_SECRET: "secret",
      TOM_GESTOR_LEADS_CLIENT_GRANT_TYPE: "client_credentials"
    }));

    getTokenMock.mockResolvedValue(ACCESS_TOKEN);
    fetchMock.mockResolvedValue({
      text: jest.fn().mockResolvedValue(JSON.stringify(mockCoverageFound))
    });

    const { checkCoverageByCoords } = await import("@lib/api/leads/coverage");
    const result = await checkCoverageByCoords(-2.170997, -79.922359, "Av. Test 123");

    expect(result.hasCoverage).toBe(true);
    expect(result.latitude).toBe(-2.170997);
    expect(result.longitude).toBe(-79.922359);
    expect(result.address).toBe("Av. Test 123");
    expect(result.coverageData).toEqual(mockCoverageFound.data.data);
    expect(result.noCoverageReason).toBeUndefined();
  });

  it("returns hasCoverage false when API returns code -1", async () => {
    jest.doMock("@lib/constants/constants", () => ({
      TOM_GESTOR_LEADS_OAUTH_URL: COVERAGE_URL,
      TOM_GESTOR_LEADS_CLIENT_ID: "id",
      TOM_GESTOR_LEADS_CLIENT_SECRET: "secret",
      TOM_GESTOR_LEADS_CLIENT_GRANT_TYPE: "client_credentials"
    }));

    getTokenMock.mockResolvedValue(ACCESS_TOKEN);
    fetchMock.mockResolvedValue({
      text: jest.fn().mockResolvedValue(JSON.stringify(mockCoverageNotFound))
    });

    const { checkCoverageByCoords } = await import("@lib/api/leads/coverage");
    const result = await checkCoverageByCoords(-0.22, -78.5);

    expect(result.hasCoverage).toBe(false);
    expect(result.coverageData).toBeUndefined();
    expect(result.noCoverageReason).toBe(
      "No existe cobertura en las coordenadas ingresadas"
    );
  });

  it("sends the correct Authorization header and body", async () => {
    jest.doMock("@lib/constants/constants", () => ({
      TOM_GESTOR_LEADS_OAUTH_URL: COVERAGE_URL,
      TOM_GESTOR_LEADS_CLIENT_ID: "id",
      TOM_GESTOR_LEADS_CLIENT_SECRET: "secret",
      TOM_GESTOR_LEADS_CLIENT_GRANT_TYPE: "client_credentials"
    }));

    getTokenMock.mockResolvedValue(ACCESS_TOKEN);
    fetchMock.mockResolvedValue({
      text: jest.fn().mockResolvedValue(JSON.stringify(mockCoverageFound))
    });

    const { checkCoverageByCoords } = await import("@lib/api/leads/coverage");
    await checkCoverageByCoords(-2.170997, -79.922359);

    expect(fetchMock).toHaveBeenCalledWith(
      `${COVERAGE_URL}/lead/integration/node-coverage`,
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: ACCESS_TOKEN,
          "Content-Type": "application/json"
        }),
        body: JSON.stringify({ lat: -2.170997, lng: -79.922359 })
      })
    );
  });

  it("throws when the response body is not valid JSON", async () => {
    jest.doMock("@lib/constants/constants", () => ({
      TOM_GESTOR_LEADS_OAUTH_URL: COVERAGE_URL,
      TOM_GESTOR_LEADS_CLIENT_ID: "id",
      TOM_GESTOR_LEADS_CLIENT_SECRET: "secret",
      TOM_GESTOR_LEADS_CLIENT_GRANT_TYPE: "client_credentials"
    }));

    getTokenMock.mockResolvedValue(ACCESS_TOKEN);
    fetchMock.mockResolvedValue({
      text: jest.fn().mockResolvedValue("<!DOCTYPE html>Not Found")
    });

    const { checkCoverageByCoords } = await import("@lib/api/leads/coverage");

    await expect(checkCoverageByCoords(-2.170997, -79.922359)).rejects.toThrow(
      "Error al parsear respuesta de cobertura"
    );
  });

  it("returns address as undefined when not provided", async () => {
    jest.doMock("@lib/constants/constants", () => ({
      TOM_GESTOR_LEADS_OAUTH_URL: COVERAGE_URL,
      TOM_GESTOR_LEADS_CLIENT_ID: "id",
      TOM_GESTOR_LEADS_CLIENT_SECRET: "secret",
      TOM_GESTOR_LEADS_CLIENT_GRANT_TYPE: "client_credentials"
    }));

    getTokenMock.mockResolvedValue(ACCESS_TOKEN);
    fetchMock.mockResolvedValue({
      text: jest.fn().mockResolvedValue(JSON.stringify(mockCoverageFound))
    });

    const { checkCoverageByCoords } = await import("@lib/api/leads/coverage");
    const result = await checkCoverageByCoords(-2.170997, -79.922359);

    expect(result.address).toBeUndefined();
  });

  it("includes rawResponse in the result", async () => {
    jest.doMock("@lib/constants/constants", () => ({
      TOM_GESTOR_LEADS_OAUTH_URL: COVERAGE_URL,
      TOM_GESTOR_LEADS_CLIENT_ID: "id",
      TOM_GESTOR_LEADS_CLIENT_SECRET: "secret",
      TOM_GESTOR_LEADS_CLIENT_GRANT_TYPE: "client_credentials"
    }));

    getTokenMock.mockResolvedValue(ACCESS_TOKEN);
    fetchMock.mockResolvedValue({
      text: jest.fn().mockResolvedValue(JSON.stringify(mockCoverageFound))
    });

    const { checkCoverageByCoords } = await import("@lib/api/leads/coverage");
    const result = await checkCoverageByCoords(-2.170997, -79.922359);

    expect(result.rawResponse).toEqual(mockCoverageFound);
  });
});

