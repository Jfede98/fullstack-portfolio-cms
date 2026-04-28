import { forwardRef, useId, useState, useRef, useEffect, type Ref } from "react";
import type { ITextFieldProps } from "@shared-ui/interfaces/textField";
import { TextFieldStyle } from "./style";
import { Icon } from "../icons";
import clsx from "clsx";

export const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, ITextFieldProps>(
  (args, ref) => {
    const defaultId = useId();
    const {
      className,
      hiddenLabel = false,
      label,
      error,
      helperText,
      showRequiredAsterisk,
      requiredAsteriskClassName,
      icon,
      combobox = false,
      options = [],
      onSelectOption,
      onSearchChange,
      loadingOptions = false,
      searchable = false,
      emptyText = "No se encontraron resultados",
      value,
      id: propId,
      ...inputProps
    } = args;

    const isAutocomplete = combobox && !!onSearchChange;

    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [inputText, setInputText] = useState("");
    const [internalValue, setInternalValue] = useState<string | undefined>(
      value as string | undefined
    );
    const wrapperRef = useRef<HTMLDivElement>(null);

    const id = propId || defaultId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;
    const isTextarea = inputProps.type === "textarea";

    useEffect(() => {
      if (combobox && value !== undefined) {
        setInternalValue(value as string);
        if (isAutocomplete && value === "") setInputText("");
      }
    }, [value, combobox, isAutocomplete]);

    const currentValue = internalValue ?? (value as string);
    const selectedOption = options.find((opt) => opt.value === currentValue);
    const comboboxDisplayValue = isAutocomplete ? inputText : (selectedOption?.label ?? "");

    const filteredOptions = isAutocomplete
      ? options
      : search
        ? options.filter((opt) =>
            opt.label.toLowerCase().includes(search.toLowerCase())
          )
        : options;

    const {
      base,
      inputWrapper,
      iconStyle,
      arrowIconStyle,
      wrapperLabel,
      labelStyle,
      helperTextStyle,
      textarea,
      dropdownWrapper,
      dropdown,
      searchWrapper,
      searchInput,
      optionsContainer,
      option,
      optionActive,
      optionDisabled,
      emptyState
    } = TextFieldStyle({
      hiddenLabel,
      hasError: !!error,
      disabled: inputProps?.disabled,
      hasIcon: !!icon,
      combobox
    });

    useEffect(() => {
      if (!combobox) return undefined;

      const handleClickOutside = (event: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearch("");
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }

      return undefined;
    }, [isOpen, combobox]);

    const handleSelect = (optionValue: string, optionLabel: string) => {
      setInternalValue(optionValue);
      if (isAutocomplete) setInputText(optionLabel);
      onSelectOption?.(optionValue);
      setIsOpen(false);
      setSearch("");
    };

    const toggleDropdown = () => {
      if (!inputProps.disabled) {
        setIsOpen((prev) => !prev);
      }
    };

    const handleAutocompleteInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputText(val);
      if (val.trim()) {
        setIsOpen(true);
        onSearchChange!(val);
      } else {
        setIsOpen(false);
        onSearchChange!("");
      }
    };

    const describedBy =
      clsx(error && errorId, helperText && helperId) || undefined;
    const shouldShowRequiredAsterisk =
      Boolean(inputProps.required) && (showRequiredAsterisk ?? combobox);
    const requiredMarkClass = requiredAsteriskClassName ?? "text-red-500";

    if (!combobox) {
      return (
        <>
          <label htmlFor={id} className={clsx(wrapperLabel(), className?.wrapperLabel)}>
            <span className={clsx(labelStyle(), className?.label)}>
              {label}
              {shouldShowRequiredAsterisk && (
                <span className={clsx("ml-1", requiredMarkClass)}>*</span>
              )}
            </span>
          </label>

          <div className={clsx(inputWrapper(), className?.inputWrapper)}>
            {icon && (
              <Icon
                name={icon}
                className={{ base: clsx(iconStyle(), className?.iconStyle) }}
                size="sm"
                type="outlined"
              />
            )}
            {isTextarea ? (
              <textarea
                id={id}
                ref={ref as Ref<HTMLTextAreaElement>}
                className={clsx(textarea(), className?.base)}
                {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                value={value as string}
                aria-invalid={!!error}
                aria-describedby={describedBy}
              />
            ) : (
              <input
                id={id}
                ref={ref as React.Ref<HTMLInputElement>}
                className={clsx(base(), className?.base)}
                {...inputProps}
                value={value}
                aria-invalid={!!error}
                aria-describedby={describedBy}
              />
            )}
          </div>

          <span
            id={error ? errorId : helperText ? helperId : undefined}
            className={helperTextStyle()}
          >
            {error ? error : helperText}
          </span>
        </>
      );
    }

    const dropdownMenu = isOpen && (
      <div className={dropdown()} role="listbox">
        {!isAutocomplete && searchable && (
          <div className={searchWrapper()}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className={searchInput()}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        <div className={optionsContainer()}>
          {loadingOptions ? (
            <div className={emptyState()}>
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Buscando...
              </span>
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className={emptyState()}>
              {isAutocomplete && inputText.trim()
                ? emptyText
                : isAutocomplete
                  ? "Escribe para buscar..."
                  : emptyText}
            </div>
          ) : (
            filteredOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="option"
                disabled={opt.disabled}
                onClick={() => !opt.disabled && handleSelect(opt.value, opt.label)}
                className={clsx(
                  option(),
                  opt.value === currentValue && optionActive(),
                  opt.disabled && optionDisabled()
                )}
                aria-selected={opt.value === currentValue}
                aria-disabled={opt.disabled}
              >
                {opt.label}
              </button>
            ))
          )}
        </div>
      </div>
    );

    return (
      <div ref={wrapperRef} className={dropdownWrapper()}>
        <label
          htmlFor={id}
          className={clsx(wrapperLabel(), className?.wrapperLabel)}
          onMouseDown={(e) => e.preventDefault()}
        >
          <span className={clsx(labelStyle(), className?.label)}>
            {label}
            {shouldShowRequiredAsterisk && (
              <span className={clsx("ml-1", requiredMarkClass)}>*</span>
            )}
          </span>
        </label>

        <div className={clsx(inputWrapper(), className?.inputWrapper)}>
          {icon && (
            <Icon
              name={icon}
              className={{ base: clsx(iconStyle(), className?.iconStyle) }}
              size="sm"
              type="outlined"
            />
          )}

          {isAutocomplete ? (
            <input
              id={id}
              ref={ref as React.Ref<HTMLInputElement>}
              className={clsx(base(), className?.base)}
              {...inputProps}
              value={comboboxDisplayValue}
              autoComplete="off"
              onChange={handleAutocompleteInput}
              onFocus={() => {
                if (options.length > 0) setIsOpen(true);
              }}
              aria-invalid={!!error}
              aria-describedby={describedBy}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-autocomplete="list"
            />
          ) : (
            <>
              <input
                id={id}
                ref={ref as React.Ref<HTMLInputElement>}
                className={clsx(base(), className?.base)}
                {...inputProps}
                value={comboboxDisplayValue}
                readOnly
                onClick={toggleDropdown}
                aria-invalid={!!error}
                aria-describedby={describedBy}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
              />
              <Icon
                name="keyboard_arrow_down"
                className={{
                  base: clsx(
                    arrowIconStyle(),
                    "transition-transform duration-200",
                    isOpen && "rotate-180"
                  )
                }}
                size="sm"
                type="outlined"
              />
            </>
          )}
        </div>

        {dropdownMenu}

        <span className={helperTextStyle()}>{error ? error : helperText}</span>
      </div>
    );
  }
);

TextField.displayName = "TextField";
