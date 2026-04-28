"use client";

import { type FC, useContext, useState } from "react";
import type { ICoverageFormProps } from "@interfaces/coverageForm";
import { Icon, TextField } from "@sitio-publico/shared-ui";
import { AddressAutocompleteField } from "./addressField";
import { useFormField } from "@hooks/useFormField";
import type { FormFieldProps } from "@interfaces/components/formField";
import { FormContactContext } from "@context/formContact";
import clsx from "clsx";


type FormProps = FormFieldProps & {
  variant?: ICoverageFormProps["variant"];
};

const VALIDATED_INPUT_TYPES = new Set(["email", "number", "tel", "idCard", "fingerprintCode"]);

const FingerprintCodeHelp = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        className={clsx(
          "inline-flex min-h-8 items-center gap-1 rounded-[4px] border px-2 py-1 text-[12px] leading-4 font-medium focus:outline-none focus:ring-2 focus:ring-[#D8B9F2]",
          isOpen
            ? "border-[#D8B9F2] bg-[#F8F0FF] text-[#83378F]"
            : "border-transparent text-[#83378F]"
        )}
        aria-expanded={isOpen}
        aria-label="Ver dónde encontrar el código dactilar"
        onClick={() => setIsOpen((current) => !current)}
      >
        <Icon
          name="info"
          type="outlined"
          size="sm"
          className={{ base: "text-[#83378F]" }}
        />
        ¿Dónde buscarlo?
      </button>
      <span
        className={clsx(
          "pointer-events-none absolute right-0 top-9 z-30 w-[292px] rounded-[12px] border border-[#DBDBDC] bg-white p-4 text-left shadow-[0_8px_24px_rgba(0,0,0,0.16)]",
          isOpen ? "block" : "hidden"
        )}
        role="tooltip"
      >
        <button
          type="button"
          className="pointer-events-auto absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-[#6E6E73] hover:bg-[#F6F6F6] focus:outline-none focus:ring-2 focus:ring-[#D8B9F2]"
          aria-label="Cerrar ayuda del código dactilar"
          onClick={() => setIsOpen(false)}
        >
          <Icon
            name="close"
            type="outlined"
            size="sm"
            className={{ base: "text-[#6E6E73]" }}
          />
        </button>
        <span className="mb-4 block text-[13px] leading-5 font-normal text-[#2C2C30]">
          Está en el reverso de tu cédula, en la esquina superior derecha.{" "}
          <strong className="font-bold">Ejemplo: D1234N5678</strong>
        </span>
        <span className="relative block h-[140px] rounded-[10px] border border-[#DBDBDC] bg-[#F6F6F6] p-4">
          <span className="mb-3 block h-4 w-28 rounded bg-[#DBDBDC]" />
          <span className="mb-2 block h-3 w-36 rounded bg-[#E8E8E9]" />
          <span className="mb-2 block h-3 w-32 rounded bg-[#E8E8E9]" />
          <span className="absolute right-4 top-4 rounded-[6px] border-2 border-[#31A451] bg-white px-2 py-1 text-[12px] leading-4 font-bold text-[#2C2C30]">
            D1234N5678
          </span>
          <span className="absolute right-[84px] top-[48px] h-8 w-[2px] bg-[#31A451]" />
          <span className="absolute right-[52px] top-[78px] rounded-full bg-[#31A451] px-2 py-1 text-[11px] leading-4 font-medium text-white">
            Código
          </span>
          <span className="absolute bottom-4 left-4 h-10 w-8 rounded bg-[#E0E0E1]" />
          <span className="absolute bottom-4 left-16 h-3 w-24 rounded bg-[#E8E8E9]" />
        </span>
      </span>
    </span>
  );
};

export const Field: FC<FormProps> = (props) => {
  const { icon, label, placeholder, searchable, loading, required = false, variant = "default" } = props;
  const { lockedFields } = useContext(FormContactContext);
  const isDsaVariant = variant === "dsa";
  const isSemiautomaticDataVariant = variant === "semiautomatic-data";

  const {
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
  } = useFormField(props);

  const isLocked = Boolean(lockedFields?.includes(fieldName as string));
  const isDisabled = (loading ?? false) || isLocked;
  const isAddressDisabled = isDisabled || isAddressBlockedByCity;
  const inputIcon = icon?.name ?? undefined;
  const rawFieldValue = isCombobox ? comboValue : formikProps.value;
  const hasFieldValue = String(rawFieldValue ?? "").trim().length > 0;
  const hasSchemaError = Boolean(props.errors?.[fieldName]);
  const hasTypeValidation = VALIDATED_INPUT_TYPES.has(props.type);
  const shouldShowFingerprintHelp =
    isSemiautomaticDataVariant && props.type === "fingerprintCode";
  const shouldShowSuccess =
    isSemiautomaticDataVariant &&
    !isAddressApiField &&
    required &&
    hasTypeValidation &&
    hasFieldValue &&
    !hasSchemaError;

  return (
    <div className={isDsaVariant ? "w-full" : "relative flex-1 min-w-50 mb-2 last:mb-0"}>
      {isAddressApiField ? (
        <AddressAutocompleteField
          label={label}
          placeholder={placeholder}
          disabled={isAddressDisabled}
          error={fieldError}
          hint={isAddressBlockedByCity ? "Selecciona una ciudad para habilitar la dirección." : undefined}
          options={addressOptions}
          loadingOptions={loadingAddresses}
          onSearchChange={onAddressSearchChange}
          onSelectOption={(value) => {
            setComboValue(value);
            props.setFieldValue(fieldName, value);
            onSelectAddress(value);
          }}
          value={comboValue}
        />
      ) : (
        <>
          {shouldShowFingerprintHelp && (
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-[14px] leading-5 font-normal text-[#2C2C30]">
                {label}
              </span>
              <FingerprintCodeHelp />
            </div>
          )}
          <div className="relative">
            <TextField
              className={
                isDsaVariant
                  ? {
                      base: "w-full h-12 border border-[#DBDBDC] rounded-[4px] px-3 py-3 text-[16px] leading-6 font-normal text-gray-500 placeholder:text-[#B7B7B9] focus:ring-0",
                      label: "text-[14px] leading-5 font-bold text-[#6E6E73] mb-2"
                    }
                  : isSemiautomaticDataVariant
                    ? {
                        base: "w-full h-12 rounded-[4px] border border-[#DBDBDC] px-3 py-3 pr-11 text-[16px] leading-6 font-normal text-[#2C2C30] placeholder:text-[#B7B7B9] focus:border-[#83378F] focus:ring-0",
                        label: "text-[14px] leading-5 font-normal text-[#2C2C30] mb-2"
                      }
                    : { base: "w-full" }
              }
              label={label}
              hiddenLabel={shouldShowFingerprintHelp}
              placeholder={placeholder}
              icon={inputIcon}
              disabled={isDisabled}
              name={props.name}
              required={required}
              showRequiredAsterisk={isDsaVariant ? true : undefined}
              requiredAsteriskClassName={isDsaVariant ? "text-[#DD3939]" : undefined}
              onBlur={formikProps.onBlur}
              error={fieldError}
              helperText={fieldError}
              combobox={isCombobox}
              searchable={isCombobox ? searchable : undefined}
              options={isCombobox ? resolvedOptions : undefined}
              loadingOptions={isCombobox ? loadingOptions : undefined}
              onSelectOption={isCombobox ? handlerSelectOption : undefined}
              value={isCombobox ? comboValue : (formikProps.value ?? "")}
              {...(!isCombobox && {
                type: props.type === "email" ? "email" : "text",
                ...(isNumeric && { inputMode: "numeric" as const, pattern: "[0-9]*" }),
                ...(maxLength !== undefined && { maxLength }),
                onChange: handlerChange
              })}
            />
            {shouldShowSuccess && (
              <span
                className={clsx(
                  "pointer-events-none absolute right-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center",
                  shouldShowFingerprintHelp ? "top-6" : "top-[52px]"
                )}
              >
                <Icon
                  name="check_circle"
                  type="rounded"
                  size="sm"
                  className={{ base: "text-[#31A451]" }}
                />
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};
