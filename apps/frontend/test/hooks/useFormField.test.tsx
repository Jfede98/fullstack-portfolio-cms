import { renderHook, act, waitFor } from "@testing-library/react";
import { useFormField } from "@hooks/useFormField";
import { FormContactInputType } from "@lib/constants/state";
import type { FormFieldProps } from "@interfaces/components/formField";

const fetchMock = jest.fn();
global.fetch = fetchMock as unknown as typeof fetch;

jest.mock("@context/cityMap", () => {
  const React = require("react");
  return { CityMapContext: React.createContext(null) };
});

jest.mock("@hooks/useAddressAutocomplete", () => ({
  useAddressAutocomplete: jest.fn(() => ({
    addressOptions: [],
    loadingAddresses: false,
    onSearchChange: jest.fn(),
    onSelectAddress: jest.fn(),
    resetAddress: jest.fn()
  }))
}));

const { CityMapContext } = require("@context/cityMap");

const mockSetSelectedCity = jest.fn();
const mockSetSelectedAddress = jest.fn();

const makeWrapper = (cityOverride?: string | null) =>
  ({ children }: any) => (
    <CityMapContext.Provider
      value={{
        selectedCity: cityOverride ?? null,
        selectedAddress: null,
        manualPinMode: false,
        mapProvider: "mapbox",
        mapToken: "pk.test",
        setSelectedCity: mockSetSelectedCity,
        setSelectedAddress: mockSetSelectedAddress,
        setManualPinMode: jest.fn(),
        setMapConfig: jest.fn()
      }}
    >
      {children}
    </CityMapContext.Provider>
  );

type TestFieldOverrides = Partial<Omit<FormFieldProps, "label" | "placeholder" | "getFieldProps">> & {
  label?: string;
  placeholder?: string;
  getFieldProps?: FormFieldProps["getFieldProps"];
};

const mockGetFieldProps = (name: string, value = ""): FormFieldProps["getFieldProps"] =>
  jest.fn().mockReturnValue({ name, value, onBlur: jest.fn(), onChange: jest.fn() }) as unknown as FormFieldProps["getFieldProps"];

const baseProps = (overrides: TestFieldOverrides = {}): FormFieldProps => ({
  name: FormContactInputType.EMAIL,
  label: "Email",
  placeholder: "Enter email",
  type: "text",
  getFieldProps: mockGetFieldProps("email", "test@test.com"),
  setFieldValue: jest.fn(),
  errors: {},
  loading: false,
  ...overrides
});

describe("useFormField", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.mockReset();
  });

  describe("fieldName resolution", () => {
    it("resolves CEDULA name to DOCUMENT fieldName", () => {
      const { result } = renderHook(
        () => useFormField(baseProps({ name: FormContactInputType.CEDULA, type: "idCard" })),
        { wrapper: makeWrapper() }
      );
      expect(result.current.fieldName).toBe(FormContactInputType.DOCUMENT);
    });

    it("resolves RUC name to DOCUMENT fieldName", () => {
      const { result } = renderHook(
        () => useFormField(baseProps({ name: FormContactInputType.RUC, type: "idCard" })),
        { wrapper: makeWrapper() }
      );
      expect(result.current.fieldName).toBe(FormContactInputType.DOCUMENT);
    });

    it("keeps fieldName equal to name for non-document fields", () => {
      const { result } = renderHook(
        () => useFormField(baseProps({ name: FormContactInputType.PHONE, type: "tel" })),
        { wrapper: makeWrapper() }
      );
      expect(result.current.fieldName).toBe(FormContactInputType.PHONE);
    });

    it("keeps fieldName equal to name for combobox fields", () => {
      const { result } = renderHook(
        () => useFormField(baseProps({ name: FormContactInputType.CITY, type: "combobox" })),
        { wrapper: makeWrapper() }
      );
      expect(result.current.fieldName).toBe(FormContactInputType.CITY);
    });
  });

  describe("maxLength", () => {
    it("returns undefined when no maxLength is provided for CEDULA", () => {
      const { result } = renderHook(
        () => useFormField(baseProps({ name: FormContactInputType.CEDULA, type: "idCard" })),
        { wrapper: makeWrapper() }
      );
      expect(result.current.maxLength).toBeUndefined();
    });

    it("returns undefined when no maxLength is provided for RUC", () => {
      const { result } = renderHook(
        () => useFormField(baseProps({ name: FormContactInputType.RUC, type: "idCard" })),
        { wrapper: makeWrapper() }
      );
      expect(result.current.maxLength).toBeUndefined();
    });

    it("returns undefined when no maxLength is provided for PHONE", () => {
      const { result } = renderHook(
        () => useFormField(baseProps({ name: FormContactInputType.PHONE, type: "tel" })),
        { wrapper: makeWrapper() }
      );
      expect(result.current.maxLength).toBeUndefined();
    });

    it("returns undefined for combobox", () => {
      const { result } = renderHook(
        () => useFormField(baseProps({ name: FormContactInputType.CITY, type: "combobox" })),
        { wrapper: makeWrapper() }
      );
      expect(result.current.maxLength).toBeUndefined();
    });
  });

  describe("isNumeric", () => {
    it("is true for PHONE", () => {
      const { result } = renderHook(
        () => useFormField(baseProps({ name: FormContactInputType.PHONE, type: "tel" })),
        { wrapper: makeWrapper() }
      );
      expect(result.current.isNumeric).toBe(true);
    });

    it("is false for EMAIL", () => {
      const { result } = renderHook(
        () => useFormField(baseProps({ name: FormContactInputType.EMAIL, type: "email" })),
        { wrapper: makeWrapper() }
      );
      expect(result.current.isNumeric).toBe(false);
    });

    it("is false for combobox regardless of type", () => {
      const { result } = renderHook(
        () => useFormField(baseProps({ name: FormContactInputType.CITY, type: "combobox" })),
        { wrapper: makeWrapper() }
      );
      expect(result.current.isNumeric).toBe(false);
    });
  });

  describe("isAddressApiField", () => {
    it("is true when optionsApi is addresses", () => {
      const { result } = renderHook(
        () => useFormField(baseProps({
          name: FormContactInputType.ADDRESS,
          type: "combobox",
          optionsSource: "api",
          optionsApi: "addresses"
        })),
        { wrapper: makeWrapper() }
      );
      expect(result.current.isAddressApiField).toBe(true);
    });

    it("is false when optionsSource is static", () => {
      const { result } = renderHook(
        () => useFormField(baseProps({
          name: FormContactInputType.ADDRESS,
          type: "combobox",
          optionsSource: "static"
        })),
        { wrapper: makeWrapper() }
      );
      expect(result.current.isAddressApiField).toBe(false);
    });

    it("is true when optionsApi is addresses, even if field name is not address", () => {
      const { result } = renderHook(
        () => useFormField(baseProps({
          name: "reference" as any,
          type: "combobox",
          optionsSource: "api",
          optionsApi: "addresses"
        })),
        { wrapper: makeWrapper() }
      );
      expect(result.current.isAddressApiField).toBe(true);
    });
  });

  describe("handlerChange", () => {
    it("strips non-numeric chars for phone field", () => {
      const setFieldValue = jest.fn();
      const { result } = renderHook(
        () => useFormField(baseProps({ name: FormContactInputType.PHONE, type: "tel", setFieldValue })),
        { wrapper: makeWrapper() }
      );

      act(() => {
        result.current.handlerChange({ target: { value: "0999-ABC-123" } } as any);
      });

      expect(setFieldValue).toHaveBeenCalledWith(FormContactInputType.PHONE, "0999123");
    });

    it("allows alphanumeric for email field", () => {
      const setFieldValue = jest.fn();
      const { result } = renderHook(
        () => useFormField(baseProps({ name: FormContactInputType.EMAIL, type: "email", setFieldValue })),
        { wrapper: makeWrapper() }
      );

      act(() => {
        result.current.handlerChange({ target: { value: "a@b.com" } } as any);
      });

      expect(setFieldValue).toHaveBeenCalledWith(FormContactInputType.EMAIL, "a@b.com");
    });
  });

  describe("api options for cities", () => {
    it("loads cities when optionsSource is api and optionsApi is cities", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: ["Quito", "Guayaquil"] })
      });

      const { result } = renderHook(
        () =>
          useFormField(
            baseProps({
              name: FormContactInputType.CITY,
              type: "combobox",
              optionsSource: "api",
              optionsApi: "cities"
            })
          ),
        { wrapper: makeWrapper() }
      );

      await waitFor(() =>
        expect(result.current.resolvedOptions).toEqual([
          { label: "Quito", value: "Quito", disabled: false },
          { label: "Guayaquil", value: "Guayaquil", disabled: false }
        ])
      );
    });

    it("returns empty options when api fetch fails", async () => {
      fetchMock.mockRejectedValueOnce(new Error("fail"));
      const { result } = renderHook(
        () =>
          useFormField(
            baseProps({
              name: FormContactInputType.CITY,
              type: "combobox",
              optionsSource: "api",
              optionsApi: "cities"
            })
          ),
        { wrapper: makeWrapper() }
      );

      await waitFor(() => expect(result.current.resolvedOptions).toEqual([]));
    });
  });

  describe("handlerSelectOption", () => {
    it("calls setFieldValue with selected value", () => {
      const setFieldValue = jest.fn();
      const { result } = renderHook(
        () => useFormField(baseProps({ name: FormContactInputType.CITY, type: "combobox", setFieldValue })),
        { wrapper: makeWrapper() }
      );

      act(() => { result.current.handlerSelectOption("Quito"); });
      expect(setFieldValue).toHaveBeenCalledWith(FormContactInputType.CITY, "Quito");
    });

    it("calls setSelectedCity for CITY field", () => {
      const { result } = renderHook(
        () => useFormField(baseProps({ name: FormContactInputType.CITY, type: "combobox" })),
        { wrapper: makeWrapper() }
      );

      act(() => { result.current.handlerSelectOption("Guayaquil"); });
      expect(mockSetSelectedCity).toHaveBeenCalledWith("Guayaquil");
    });

    it("sets city to null when empty value selected on CITY field", () => {
      const { result } = renderHook(
        () => useFormField(baseProps({
          name: FormContactInputType.CITY,
          type: "combobox",
          required: false
        })),
        { wrapper: makeWrapper() }
      );

      act(() => { result.current.handlerSelectOption(""); });
      expect(mockSetSelectedCity).toHaveBeenCalledWith(null);
    });

    it("does not call setFieldValue for non-required empty selection", () => {
      const setFieldValue = jest.fn();
      const { result } = renderHook(
        () => useFormField(baseProps({
          name: "province" as any,
          type: "combobox",
          required: false,
          setFieldValue
        })),
        { wrapper: makeWrapper() }
      );

      act(() => { result.current.handlerSelectOption(""); });
      expect(setFieldValue).not.toHaveBeenCalled();
    });
  });

  describe("fieldError", () => {
    it("returns schema error for combobox with errors", () => {
      const { result } = renderHook(
        () => useFormField(baseProps({
          name: "province" as any,
          type: "combobox",
          required: true,
          errors: { province: "Schema error" } as any,
          submitCount: 1
        })),
        { wrapper: makeWrapper() }
      );
      expect(result.current.fieldError).toBe("Schema error");
    });

    it("returns required error for combobox when submitCount > 0 and no value", () => {
      const { result } = renderHook(
        () => useFormField(baseProps({
          name: "province" as any,
          type: "combobox",
          required: true,
          errors: {},
          submitCount: 1,
          getFieldProps: mockGetFieldProps("province", "")
        })),
        { wrapper: makeWrapper() }
      );
      expect(result.current.fieldError).toBe("Este campo es requerido");
    });

    it("returns undefined error for non-required combobox", () => {
      const { result } = renderHook(
        () => useFormField(baseProps({
          name: "province" as any,
          type: "combobox",
          required: false,
          errors: {},
          submitCount: 1
        })),
        { wrapper: makeWrapper() }
      );
      expect(result.current.fieldError).toBeUndefined();
    });
  });

  describe("cities API fetch (useApiOptions)", () => {
    it("loads cities from /api/address-catalog/cities", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue({ data: ["Quito", "Guayaquil", "Cuenca"] })
      });

      const { result } = renderHook(
        () => useFormField(baseProps({
          name: FormContactInputType.CITY,
          type: "combobox",
          optionsSource: "api",
          optionsApi: "cities"
        })),
        { wrapper: makeWrapper() }
      );

      await waitFor(() => expect(result.current.loadingOptions).toBe(false));
      expect(result.current.resolvedOptions).toHaveLength(3);
      expect(result.current.resolvedOptions[0]).toEqual({ label: "Quito", value: "Quito", disabled: false });
    });

    it("sets empty options when cities API fails", async () => {
      fetchMock.mockResolvedValueOnce({ ok: false });

      const { result } = renderHook(
        () => useFormField(baseProps({
          name: FormContactInputType.CITY,
          type: "combobox",
          optionsSource: "api",
          optionsApi: "cities"
        })),
        { wrapper: makeWrapper() }
      );

      await waitFor(() => expect(result.current.loadingOptions).toBe(false));
      expect(result.current.resolvedOptions).toEqual([]);
    });

    it("returns static options when optionsSource is static", () => {
      const options = [{ label: "A", value: "a" }];
      const { result } = renderHook(
        () => useFormField(baseProps({
          name: "province" as any,
          type: "combobox",
          optionsSource: "static",
          options
        })),
        { wrapper: makeWrapper() }
      );

      expect(result.current.resolvedOptions).toEqual(options);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe("city change resets address field", () => {
    it("clears address field value when selectedCity changes", async () => {
      const setFieldValue = jest.fn();
      let currentCity = "Quito";

      const wrapper = ({ children }: any) => (
        <CityMapContext.Provider
          value={{
            selectedCity: currentCity,
            selectedAddress: null,
            manualPinMode: false,
            mapProvider: "mapbox",
            mapToken: "pk.test",
            setSelectedCity: mockSetSelectedCity,
            setSelectedAddress: mockSetSelectedAddress,
            setManualPinMode: jest.fn(),
            setMapConfig: jest.fn()
          }}
        >
          {children}
        </CityMapContext.Provider>
      );

      const { rerender } = renderHook(
        () => useFormField(baseProps({
          name: FormContactInputType.ADDRESS,
          type: "combobox",
          optionsSource: "api",
          optionsApi: "addresses",
          setFieldValue
        })),
        { wrapper }
      );

      currentCity = "Guayaquil";
      rerender();

      await waitFor(() => {
        expect(setFieldValue).toHaveBeenCalledWith(FormContactInputType.ADDRESS, "");
      });
    });
  });
});







