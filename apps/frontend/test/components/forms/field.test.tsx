import { render, act, fireEvent, screen } from "@testing-library/react";
import { Field } from "@components/forms/contact/field";
import { FormContactInputType } from "@lib/constants/state";

const TextFieldMock: any = jest.fn(() => <div data-testid="field" />);
const AddressAutocompleteMock: any = jest.fn(() => <div data-testid="address-field" />);
const IconMock: any = jest.fn(() => <div data-testid="icon" />);

jest.mock("@sitio-publico/shared-ui", () => ({
  TextField: (props: any) => TextFieldMock(props),
  Icon: (props: any) => IconMock(props)
}));

jest.mock("@components/forms/contact/addressField", () => ({
  AddressAutocompleteField: (props: any) => AddressAutocompleteMock(props)
}));

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
const defaultContext = {
  selectedCity: null,
  selectedAddress: null,
  manualPinMode: false,
  mapProvider: "mapbox" as const,
  mapToken: "pk.test",
  setSelectedCity: mockSetSelectedCity,
  setSelectedAddress: jest.fn(),
  setManualPinMode: jest.fn(),
  setMapConfig: jest.fn()
};

const renderField = (props: any, ctx = defaultContext) =>
  render(
    <CityMapContext.Provider value={ctx}>
      <Field {...props} />
    </CityMapContext.Provider>
  );

describe("Field", () => {
  beforeEach(() => {
    TextFieldMock.mockClear();
    AddressAutocompleteMock.mockClear();
    mockSetSelectedCity.mockClear();
    IconMock.mockClear();
  });

  describe("base input (numeric)", () => {
    it("normalizes document fields and maxLength", () => {
      const setFieldValue = jest.fn();
      const getFieldProps = jest.fn(() => ({
        name: "document",
        value: "",
        onBlur: jest.fn()
      }));

      renderField({
        name: FormContactInputType.CEDULA,
        label: "Doc",
        placeholder: "Doc",
        getFieldProps: getFieldProps as any,
        setFieldValue: setFieldValue as any,
        errors: {},
        loading: false,
        type: ""
      });

      const onChange = TextFieldMock.mock.calls[0][0].onChange;
      onChange({ target: { value: "ABC123456789999" } });

      expect(setFieldValue).toHaveBeenCalledWith(
        FormContactInputType.DOCUMENT,
        "123456789999"
      );
      expect(TextFieldMock).toHaveBeenCalledWith(
        expect.objectContaining({
          name: FormContactInputType.CEDULA
        })
      );
    });

    it("uses phone field when name is not document", () => {
      const setFieldValue = jest.fn();
      const getFieldProps = jest.fn(() => ({
        name: "phone",
        value: "",
        onBlur: jest.fn()
      }));

      renderField({
        name: FormContactInputType.PHONE,
        label: "Tel",
        placeholder: "Tel",
        required: true,
        maxLength: 10,
        getFieldProps: getFieldProps as any,
        setFieldValue: setFieldValue as any,
        errors: { phone: "Error" } as any,
        loading: false,
        type: ""
      });

      const onChange = TextFieldMock.mock.calls[0][0].onChange;
      onChange({ target: { value: "09999999999" } });

      expect(setFieldValue).toHaveBeenCalledWith(
        FormContactInputType.PHONE,
        "0999999999"
      );
      expect(TextFieldMock).toHaveBeenCalledWith(
        expect.objectContaining({
          maxLength: 10
        })
      );
    });

    it("maps ruc name to document fieldName", () => {
      const setFieldValue = jest.fn();
      const getFieldProps = jest.fn(() => ({
        name: "document",
        value: "",
        onBlur: jest.fn()
      }));

      renderField({
        name: FormContactInputType.RUC,
        label: "RUC",
        placeholder: "RUC",
        getFieldProps: getFieldProps as any,
        setFieldValue: setFieldValue as any,
        errors: {},
        loading: false,
        type: ""
      });

      const onChange = TextFieldMock.mock.calls[0][0].onChange;
      onChange({ target: { value: "1234567890001" } });

      expect(setFieldValue).toHaveBeenCalledWith(
        FormContactInputType.DOCUMENT,
        "1234567890001"
      );
      expect(TextFieldMock).toHaveBeenCalledWith(
        expect.objectContaining({ name: FormContactInputType.RUC })
      );
    });

    it("two base inputs with different names are independent", () => {
      const setFieldValue1 = jest.fn();
      const setFieldValue2 = jest.fn();
      const getFieldProps1 = jest.fn(() => ({ name: "document", value: "aaa", onBlur: jest.fn() }));
      const getFieldProps2 = jest.fn(() => ({ name: "phone", value: "bbb", onBlur: jest.fn() }));

      const { rerender } = render(
        <CityMapContext.Provider value={defaultContext}>
          <Field
            name={FormContactInputType.CEDULA}
            label="Cédula"
            placeholder="Cédula"
            getFieldProps={getFieldProps1 as any}
            setFieldValue={setFieldValue1 as any}
            errors={{}}
            loading={false}
            type=""
          />
        </CityMapContext.Provider>
      );

      expect(TextFieldMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ value: "aaa" })
      );

      TextFieldMock.mockClear();

      rerender(
        <CityMapContext.Provider value={defaultContext}>
          <Field
            name={FormContactInputType.PHONE}
            label="Teléfono"
            placeholder="Teléfono"
            getFieldProps={getFieldProps2 as any}
            setFieldValue={setFieldValue2 as any}
            errors={{}}
            loading={false}
            type=""
          />
        </CityMapContext.Provider>
      );

      expect(TextFieldMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ value: "bbb" })
      );
    });
  });

  describe("combobox input", () => {
    it("renders as combobox with static options", () => {
      const setFieldValue = jest.fn();
      const getFieldProps = jest.fn(() => ({
        name: "province",
        value: "",
        onBlur: jest.fn()
      }));
      const options = [
        { label: "Pichincha", value: "pichincha" },
        { label: "Guayas", value: "guayas" }
      ];

      renderField({
        name: "province" as any,
        label: "Provincia",
        placeholder: "Selecciona",
        type: "combobox",
        options: options,
        getFieldProps: getFieldProps as any,
        setFieldValue: setFieldValue as any,
        errors: {},
        loading: false
      });

      expect(TextFieldMock).toHaveBeenCalledWith(
        expect.objectContaining({
          combobox: true,
          options
        })
      );
    });

    it("calls setFieldValue and updates comboValue on option select", () => {
      const setFieldValue = jest.fn();
      const getFieldProps = jest.fn(() => ({
        name: "province",
        value: "",
        onBlur: jest.fn()
      }));

      renderField({
        name: "province" as any,
        label: "Provincia",
        placeholder: "Selecciona",
        type: "combobox",
        options: [{ label: "Pichincha", value: "pichincha" }],
        getFieldProps: getFieldProps as any,
        setFieldValue: setFieldValue as any,
        errors: {},
        loading: false
      });

      const onSelectOption = TextFieldMock.mock.calls[0][0].onSelectOption;
      act(() => {
        onSelectOption("pichincha");
      });
      expect(setFieldValue).toHaveBeenCalledWith("province", "pichincha");
    });

    it("does not call setFieldValue when selecting empty value on non-required combobox", () => {
      const setFieldValue = jest.fn();
      const getFieldProps = jest.fn(() => ({
        name: "province",
        value: "",
        onBlur: jest.fn()
      }));

      renderField({
        name: "province" as any,
        label: "Provincia",
        placeholder: "Selecciona",
        type: "combobox",
        required: false,
        options: [{ label: "Pichincha", value: "pichincha" }],
        getFieldProps: getFieldProps as any,
        setFieldValue: setFieldValue as any,
        errors: {},
        loading: false
      });

      const onSelectOption = TextFieldMock.mock.calls[0][0].onSelectOption;
      act(() => {
        onSelectOption("");
      });
      expect(setFieldValue).not.toHaveBeenCalled();
    });

    it("calls setFieldValue with empty value when combobox is required", () => {
      const setFieldValue = jest.fn();
      const getFieldProps = jest.fn(() => ({
        name: "province",
        value: "",
        onBlur: jest.fn()
      }));

      renderField({
        name: "province" as any,
        label: "Provincia",
        placeholder: "Selecciona",
        type: "combobox",
        required: true,
        options: [{ label: "Pichincha", value: "pichincha" }],
        getFieldProps: getFieldProps as any,
        setFieldValue: setFieldValue as any,
        errors: {},
        loading: false
      });

      const onSelectOption = TextFieldMock.mock.calls[0][0].onSelectOption;
      act(() => {
        onSelectOption("");
      });
      expect(setFieldValue).toHaveBeenCalledWith("province", "");
    });

    it("shows required error when combobox is empty and submitCount > 0", () => {
      const setFieldValue = jest.fn();
      const getFieldProps = jest.fn(() => ({
        name: "province",
        value: "",
        onBlur: jest.fn()
      }));

      renderField({
        name: "province" as any,
        label: "Provincia",
        placeholder: "Selecciona",
        type: "combobox",
        required: true,
        options: [{ label: "Pichincha", value: "pichincha" }],
        getFieldProps: getFieldProps as any,
        setFieldValue: setFieldValue as any,
        errors: {},
        touched: {},
        submitCount: 1,
        loading: false
      });

      expect(TextFieldMock).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Este campo es requerido"
        })
      );
    });

    it("shows required error when combobox is empty and field is touched", () => {
      const setFieldValue = jest.fn();
      const getFieldProps = jest.fn(() => ({
        name: "province",
        value: "",
        onBlur: jest.fn()
      }));

      renderField({
        name: "province" as any,
        label: "Provincia",
        placeholder: "Selecciona",
        type: "combobox",
        required: true,
        options: [{ label: "Pichincha", value: "pichincha" }],
        getFieldProps: getFieldProps as any,
        setFieldValue: setFieldValue as any,
        errors: {},
        touched: { province: true } as any,
        submitCount: 0,
        loading: false
      });

      expect(TextFieldMock).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Este campo es requerido"
        })
      );
    });

    it("does not show error when combobox is empty but not touched and submitCount is 0", () => {
      const setFieldValue = jest.fn();
      const getFieldProps = jest.fn(() => ({
        name: "province",
        value: "",
        onBlur: jest.fn()
      }));

      renderField({
        name: "province" as any,
        label: "Provincia",
        placeholder: "Selecciona",
        type: "combobox",
        required: true,
        options: [{ label: "Pichincha", value: "pichincha" }],
        getFieldProps: getFieldProps as any,
        setFieldValue: setFieldValue as any,
        errors: {},
        touched: {},
        submitCount: 0,
        loading: false
      });

      expect(TextFieldMock).toHaveBeenCalledWith(
        expect.objectContaining({
          error: undefined
        })
      );
    });

    it("does not show error when combobox is not required even with submitCount > 0", () => {
      const setFieldValue = jest.fn();
      const getFieldProps = jest.fn(() => ({
        name: "province",
        value: "",
        onBlur: jest.fn()
      }));

      renderField({
        name: "province" as any,
        label: "Provincia",
        placeholder: "Selecciona",
        type: "combobox",
        required: false,
        options: [{ label: "Pichincha", value: "pichincha" }],
        getFieldProps: getFieldProps as any,
        setFieldValue: setFieldValue as any,
        errors: {},
        touched: {},
        submitCount: 1,
        loading: false
      });

      expect(TextFieldMock).toHaveBeenCalledWith(
        expect.objectContaining({
          error: undefined
        })
      );
    });

    it("shows schema error over empty error when errors[fieldName] exists", () => {
      const setFieldValue = jest.fn();
      const getFieldProps = jest.fn(() => ({
        name: "province",
        value: "",
        onBlur: jest.fn()
      }));

      renderField({
        name: "province" as any,
        label: "Provincia",
        placeholder: "Selecciona",
        type: "combobox",
        required: true,
        options: [{ label: "Pichincha", value: "pichincha" }],
        getFieldProps: getFieldProps as any,
        setFieldValue: setFieldValue as any,
        errors: { province: "Error de validación" } as any,
        touched: {},
        submitCount: 1,
        loading: false
      });

      expect(TextFieldMock).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Error de validación"
        })
      );
    });
  });

  describe("address autocomplete input", () => {
    it("renders address field with hint when city is missing", () => {
      const setFieldValue = jest.fn();
      const getFieldProps = jest.fn(() => ({
        name: "address",
        value: "",
        onBlur: jest.fn()
      }));

      renderField({
        name: FormContactInputType.ADDRESS,
        label: "Dirección",
        placeholder: "Ingresa",
        type: "combobox",
        optionsSource: "api",
        optionsApi: "addresses",
        getFieldProps: getFieldProps as any,
        setFieldValue: setFieldValue as any,
        errors: {},
        loading: false
      });

      expect(AddressAutocompleteMock).toHaveBeenCalledWith(
        expect.objectContaining({
          hint: "Selecciona una ciudad para habilitar la dirección."
        })
      );
    });
  });

  describe("fingerprint help", () => {
    it("shows help and success icon for fingerprint code", () => {
      const getFieldProps = jest.fn(() => ({
        name: "finger",
        value: "D1234N5678",
        onBlur: jest.fn()
      }));

      renderField({
        name: "finger",
        label: "Código",
        placeholder: "Ingresa",
        required: true,
        type: "fingerprintCode",
        getFieldProps: getFieldProps as any,
        setFieldValue: jest.fn() as any,
        errors: {},
        loading: false,
        variant: "semiautomatic-data"
      });

      expect(IconMock).toHaveBeenCalled();
    });

    it("toggles fingerprint help tooltip", () => {
      const getFieldProps = jest.fn(() => ({
        name: "finger",
        value: "",
        onBlur: jest.fn()
      }));

      renderField({
        name: "finger",
        label: "Código",
        placeholder: "Ingresa",
        required: false,
        type: "fingerprintCode",
        getFieldProps: getFieldProps as any,
        setFieldValue: jest.fn() as any,
        errors: {},
        loading: false,
        variant: "semiautomatic-data"
      });

      fireEvent.click(screen.getByRole("button", { name: "Ver dónde encontrar el código dactilar" }));
      expect(screen.getByRole("tooltip")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Cerrar ayuda del código dactilar" }));
      expect(screen.getByRole("button", { name: "Ver dónde encontrar el código dactilar" })).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("address API field (optionsSource: api, name: address)", () => {
    const baseProps = {
      name: FormContactInputType.ADDRESS as any,
      label: "Address",
      placeholder: "Search address",
      type: "combobox" as any,
      optionsSource: "api" as const,
      optionsApi: "addresses" as const,
      getFieldProps: jest.fn(() => ({ name: "address", value: "", onBlur: jest.fn() })),
      setFieldValue: jest.fn(),
      errors: {},
      loading: false
    };

    it("renders AddressAutocompleteField instead of TextField", () => {
      renderField(baseProps);
      expect(AddressAutocompleteMock).toHaveBeenCalled();
      expect(TextFieldMock).not.toHaveBeenCalled();
    });

    it("passes label and placeholder to AddressAutocompleteField", () => {
      renderField(baseProps, { ...defaultContext, selectedCity: "Guayaquil" as any });
      expect(AddressAutocompleteMock).toHaveBeenCalledWith(
        expect.objectContaining({
          label: "Address",
          placeholder: "Search address"
        })
      );
    });

    it("keeps address disabled and shows city hint when no city is selected", () => {
      renderField(baseProps);
      expect(AddressAutocompleteMock).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: true,
          placeholder: "Search address",
          hint: "Selecciona una ciudad para habilitar la dirección."
        })
      );
    });

    it("passes loading state as disabled to AddressAutocompleteField", () => {
      renderField({ ...baseProps, loading: true });
      expect(AddressAutocompleteMock).toHaveBeenCalledWith(
        expect.objectContaining({ disabled: true })
      );
    });

    it("passes error to AddressAutocompleteField when field has errors", () => {
      renderField({
        ...baseProps,
        required: true,
        errors: { address: "Required field" } as any,
        touched: { address: true } as any
      });
      expect(AddressAutocompleteMock).toHaveBeenCalledWith(
        expect.objectContaining({ error: "Required field" })
      );
    });

    it("calls setFieldValue when an address option is selected", () => {
      const setFieldValue = jest.fn();
      renderField({ ...baseProps, setFieldValue: setFieldValue as any });

      const onSelectOption = AddressAutocompleteMock.mock.calls[0][0].onSelectOption;
      act(() => onSelectOption("Av. República 123"));

      expect(setFieldValue).toHaveBeenCalledWith("address", "Av. República 123");
    });
  });

  describe("loadingOptions in combobox", () => {
    it("passes loadingOptions to TextField when combobox is loading cities", () => {
      renderField({
        name: "city" as any,
        label: "City",
        placeholder: "Select city",
        type: "combobox",
        optionsSource: "api",
        optionsApi: "cities",
        getFieldProps: jest.fn(() => ({ name: "city", value: "", onBlur: jest.fn() })),
        setFieldValue: jest.fn(),
        errors: {},
        loading: false
      });

      expect(TextFieldMock).toHaveBeenCalledWith(
        expect.objectContaining({
          combobox: true,
          loadingOptions: expect.any(Boolean)
        })
      );
    });
  });
});
