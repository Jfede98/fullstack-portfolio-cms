"use client";

import { useId, useRef, useState, useEffect, useContext, type FC } from "react";
import { CityMapContext } from "@context/cityMap";
import { AddressFieldStyle } from "./style";
import { useAddressGeolocation } from "@hooks/useAddressGeolocation.ts";
import type { IAddressAutocompleteFieldProps } from "@interfaces/components/addressField";
import type { IComboboxOption } from "@interfaces/coverageForm";

const SpinnerIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);


export const AddressAutocompleteField: FC<IAddressAutocompleteFieldProps> = ({
  label,
  placeholder,
  disabled = false,
  error,
  hint,
  options,
  loadingOptions = false,
  onSearchChange,
  onSelectOption,
  value: externalValue = "",
}) => {
  const id = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lastAppliedAddressRef = useRef<string>("");
  const onSelectOptionRef = useRef(onSelectOption);
  const [inputText, setInputText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    onSelectOptionRef.current = onSelectOption;
  });

  const {
    mapProvider,
    mapToken,
    selectedAddress,
    setSelectedAddress,
    manualPinMode,
    setManualPinMode,
  } = useContext(CityMapContext);

  const { locLoading, locError, handleCurrentLocation } = useAddressGeolocation({
    mapProvider,
    mapToken,
    onSuccess: (result) => {
      setInputText(result.label);
      setSelectedValue(result.label);
      onSelectOption(result.label);
      setSelectedAddress({ latitude: result.latitude, longitude: result.longitude, label: result.label });
      setManualPinMode(false);
    },
    onOpen: () => setIsOpen(false),
  });

  useEffect(() => {
    if (externalValue === "") {
      setInputText("");
      setSelectedValue("");
      lastAppliedAddressRef.current = "";
      setIsOpen(false);
    }
  }, [externalValue]);

  useEffect(() => {
    if (!selectedAddress?.label) return;
    if (selectedAddress.label === lastAppliedAddressRef.current) return;
    lastAppliedAddressRef.current = selectedAddress.label;
    setInputText(selectedAddress.label);
    setSelectedValue(selectedAddress.label);
    onSelectOptionRef.current(selectedAddress.label);
  }, [selectedAddress]);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);
    setSelectedValue("");
    lastAppliedAddressRef.current = "";
    if (manualPinMode) setManualPinMode(false);
    if (val.trim().length >= 2) {
      setIsOpen(true);
      onSearchChange(val);
    } else {
      setIsOpen(false);
      onSearchChange("");
    }
  };

  const handleSelect = (opt: IComboboxOption) => {
    setInputText(opt.label);
    setSelectedValue(opt.value);
    setIsOpen(false);
    setManualPinMode(false);
    onSelectOption(opt.value);
  };

  const hasResults = options.length > 0;
  const isDisabled = disabled || locLoading;

  const s = AddressFieldStyle({
    disabled: isDisabled,
    hasError: !!error,
    locationLoading: locLoading,
    pinMode: manualPinMode,
  });

  return (
    <div ref={wrapperRef} className={s.wrapper()}>
      <label htmlFor={id} className="block">
        <span className={s.labelText()}>{label}</span>
      </label>

      <div className={s.inputWrapper()}>
        <input
          id={id}
          type="text"
          autoComplete="off"
          disabled={isDisabled}
          placeholder={locLoading ? "Obteniendo ubicación..." : placeholder}
          value={inputText}
          onChange={handleInput}
          onFocus={() => setIsOpen(true)}
          className={s.input()}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-invalid={!!error}
        />
        {locLoading && (
          <span className={s.spinnerWrapper()}>
            <SpinnerIcon className="animate-spin h-5 w-5 text-primary-500" />
          </span>
        )}
      </div>

      {locError && (
        <span className={s.errorText()}>{locError}</span>
      )}

      {error && !locError && (
        <span className={s.errorText()}>{error}</span>
      )}

      {hint && !error && !locError && (
        <span className={s.hintText()}>{hint}</span>
      )}

      {isOpen && (
        <div role="listbox" className={s.dropdown()}>
          <div className={s.dropdownInner()}>
            {loadingOptions ? (
              <div className={s.loadingRow()}>
                <span className={s.loadingRowInner()}>
                  <SpinnerIcon className="animate-spin h-4 w-4 text-gray-400" />
                  Buscando...
                </span>
              </div>
            ) : hasResults ? (
              options.slice(0, 3).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(opt)}
                  className={AddressFieldStyle({ selected: opt.value === selectedValue }).option()}
                  aria-selected={opt.value === selectedValue}
                >
                  {opt.label}
                </button>
              ))
            ) : inputText.trim().length >= 2 ? (
              <div className={s.emptyRow()}>No se encontraron resultados</div>
            ) : (
              <div className={s.hintRow()}>Escribe para buscar una dirección</div>
            )}

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleCurrentLocation}
              disabled={locLoading}
              className={s.locationBtn()}
            >
              {locLoading ? (
                <>
                  <SpinnerIcon className="animate-spin h-4 w-4 text-primary-400 shrink-0" />
                  Obteniendo ubicación...
                </>
              ) : (
                <> Usar mi ubicación Actual</>
              )}
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                // If a pin already exists, user should adjust it by dragging.
                // Manual pin mode is only needed to place the first point by clicking.
                setManualPinMode(!selectedAddress);
                setIsOpen(false);
                document.getElementById("address-map-selector")?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }}
              className={s.mapPinBtn()}
            >
              {selectedAddress ? "Mover pin en el mapa" : "Fijar en el mapa"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
