"use client";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { CityMapContext } from "@context/cityMap";
import { useAddressAutocomplete } from "@hooks/useAddressAutocomplete";
import { FormContactInputType } from "@lib/constants/state";
import type { IComboboxOption } from "@interfaces/coverageForm";
import type { FormFieldProps } from "@interfaces/components/formField";

const NUMERIC_TYPES = ["tel", "number", "idCard"];

export const useFormField = ({
  name,
  type,
  maxLength: maxLengthProp,
  optionsSource = "static",
  optionsApi,
  options: staticOptions,
  required = false,
  getFieldProps,
  setFieldValue,
  errors,
  touched,
  submitCount = 0,
}: FormFieldProps) => {
  const isCombobox = type === "combobox";

  const fieldName = isCombobox
    ? name
    : name === FormContactInputType.CEDULA || name === FormContactInputType.RUC
      ? FormContactInputType.DOCUMENT
      : name;

  const formikProps = getFieldProps(fieldName);
  const normalizedMaxLength =
    typeof maxLengthProp === "number" && Number.isFinite(maxLengthProp)
      ? maxLengthProp
      : undefined;

  const maxLength = (() => {
    if (isCombobox) return undefined;
    if (type === "fingerprintCode") return normalizedMaxLength ?? 10;
    return normalizedMaxLength;
  })();

  const isNumeric =
    !isCombobox &&
    (NUMERIC_TYPES.includes(type) ||
      fieldName === FormContactInputType.DOCUMENT ||
      name === FormContactInputType.CEDULA ||
      name === FormContactInputType.RUC ||
      name === FormContactInputType.PHONE);

  const { setSelectedCity, selectedCity, mapProvider, mapToken } = useContext(CityMapContext);

  const isCityField = name === FormContactInputType.CITY;
  const isAddressApiField =
    optionsSource === "api" && optionsApi === "addresses";
  const isAddressBlockedByCity = isAddressApiField && !selectedCity;
  const useApiOptions = isCombobox && optionsSource === "api" && optionsApi === "cities";

  const [comboValue, setComboValue] = useState("");
  const [apiOptions, setApiOptions] = useState<IComboboxOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  const {
    addressOptions,
    loadingAddresses,
    onSearchChange: onAddressSearchChange,
    onSelectAddress,
    resetAddress,
  } = useAddressAutocomplete({ provider: mapProvider, mapboxToken: mapToken });

  const prevCityRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isAddressApiField) return;
    if (prevCityRef.current !== null && prevCityRef.current !== selectedCity) {
      setComboValue("");
      setFieldValue(fieldName, "");
      resetAddress();
    }
    prevCityRef.current = selectedCity;
  }, [selectedCity, isAddressApiField, fieldName, setFieldValue, resetAddress]);

  useEffect(() => {
    if (!useApiOptions) return;
    const controller = new AbortController();

    const loadCities = async () => {
      try {
        setLoadingOptions(true);
        const response = await fetch("/api/address-catalog/cities", { signal: controller.signal });
        if (!response.ok) return;
        const payload = (await response.json()) as { data?: string[] };
        setApiOptions(
          (payload?.data ?? []).map((city) => ({ label: city, value: city, disabled: false }))
        );
      } catch {
        setApiOptions([]);
      } finally {
        setLoadingOptions(false);
      }
    };

    void loadCities();
    return () => controller.abort();
  }, [useApiOptions]);

  const resolvedOptions: IComboboxOption[] = useMemo(() => {
    if (!isCombobox) return [];
    return useApiOptions ? apiOptions : (staticOptions ?? []);
  }, [apiOptions, isCombobox, staticOptions, useApiOptions]);

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const value = (() => {
      if (isNumeric) {
        const numericValue = raw.replace(/\D/g, "");
        return maxLength !== undefined
          ? numericValue.slice(0, maxLength)
          : numericValue;
      }
      if (type === "fingerprintCode") {
        const fingerprintValue = raw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
        return maxLength !== undefined
          ? fingerprintValue.slice(0, maxLength)
          : fingerprintValue;
      }
      return maxLength !== undefined ? raw.slice(0, maxLength) : raw;
    })();
    setFieldValue(fieldName, value);
  };

  const handlerSelectOption = (value: string) => {
    setComboValue(value);
    if (value || required) setFieldValue(fieldName, value);
    if (isCityField) setSelectedCity(value || null);
    if (isAddressApiField) onSelectAddress(value);
  };

  const comboboxTouched = !!(touched as Record<string, unknown>)?.[fieldName];
  const fieldTouched = !!(touched as Record<string, unknown>)?.[fieldName];
  const shouldShowComboError = isCombobox && required && (comboboxTouched || submitCount > 0);
  const schemaError = errors[fieldName] ? String(errors[fieldName]) : undefined;
  const comboboxEmptyError = shouldShowComboError && !comboValue ? "Este campo es requerido" : undefined;
  const fieldError = isCombobox
    ? (schemaError ?? comboboxEmptyError)
    : required && (fieldTouched || submitCount > 0) && errors[fieldName]
      ? String(errors[fieldName])
      : undefined;

  return {
    fieldName,
    formikProps,
    maxLength,
    isCombobox,
    isNumeric,
    isAddressApiField,
    isAddressBlockedByCity,
    comboValue,
    setComboValue,
    resolvedOptions,
    loadingOptions,
    addressOptions,
    loadingAddresses,
    onAddressSearchChange,
    onSelectAddress,
    handlerChange,
    handlerSelectOption,
    fieldError,
  };
};
