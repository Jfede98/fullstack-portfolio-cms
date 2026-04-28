import type { FC } from "react";
import { useState } from "react";
import clsx from "clsx";
import { Dropdown } from "@shared-ui/components/dropdown";
import { Typography } from "@shared-ui/components/typography";
import { CentersFiltersStyle } from "./style";
import type { ICentersFiltersProps } from "@shared-ui/interfaces/centersFilters";

export const CentersFilters: FC<ICentersFiltersProps> = ({
  title,
  subtitle,
  searchLabel,
  centerTypeLabel,
  kioskTypeLabel,
  cityDropdownLabel,
  serviceDropdownLabel,
  cities,
  services,
  onServiceTypeChange,
  onCityChange,
  onServiceChange,
  className
}) => {
  const [selectedServiceType, setSelectedServiceType] = useState<"centro_experiencia" | "kiosco">("centro_experiencia");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");

  const {
    wrapper,
    header,
    title: titleStyle,
    subtitle: subtitleStyle,
    searchSection,
    searchLabel: searchLabelStyle,
    toggleButtons,
    toggleButton,
    activeToggle,
    filtersSection,
    dropdownWrapper
  } = CentersFiltersStyle();

  const handleServiceTypeChange = (type: "centro_experiencia" | "kiosco") => {
    setSelectedServiceType(type);
    if (onServiceTypeChange) {
      onServiceTypeChange(type);
    }
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    if (onCityChange) {
      onCityChange(city);
    }
  };

  const handleServiceChange = (service: string) => {
    setSelectedService(service);
    if (onServiceChange) {
      onServiceChange(service);
    }
  };

  const cityOptions = cities.map(city => ({
    label: city,
    value: city,
    onClick: () => handleCityChange(city)
  }));

  const serviceOptions = services.map(service => ({
    label: service,
    value: service,
    onClick: () => handleServiceChange(service)
  }));

  return (
    <div className={clsx(wrapper(), className?.wrapper)}>
      <div className={clsx(header(), className?.header)}>
        <Typography
          tag="h1"
          variant="title"
          type="bold"
          className={{
            base: clsx(titleStyle(), className?.title)
          }}
        >
          {title}
        </Typography>
        
        {subtitle && (
          <Typography
            tag="p"
            variant="body"
            type="regular"
            className={{
              base: clsx(subtitleStyle(), className?.subtitle)
            }}
          >
            {subtitle}
          </Typography>
        )}
      </div>

      <div className={clsx(searchSection(), className?.searchSection)}>
        <span className={clsx(searchLabelStyle(), className?.searchLabel)}>
          {searchLabel}
        </span>
        
        <div className={clsx(toggleButtons(), className?.toggleButtons)}>
          <button
            className={clsx(
              toggleButton(),
              selectedServiceType === "centro_experiencia" && activeToggle(),
              className?.toggleButton,
              selectedServiceType === "centro_experiencia" && className?.activeToggle
            )}
            onClick={() => handleServiceTypeChange("centro_experiencia")}
          >
            {centerTypeLabel}
          </button>
          
          <button
            className={clsx(
              toggleButton(),
              selectedServiceType === "kiosco" && activeToggle(),
              className?.toggleButton,
              selectedServiceType === "kiosco" && className?.activeToggle
            )}
            onClick={() => handleServiceTypeChange("kiosco")}
          >
            {kioskTypeLabel}
          </button>
        </div>
      </div>

      <div className={clsx(filtersSection(), className?.filtersSection)}>
        <div className={clsx(dropdownWrapper(), className?.dropdownWrapper)}>
          <Dropdown
            trigger={
              <div className="w-full p-3 border border-gray-300 rounded-lg bg-white text-left">
                {selectedCity || cityDropdownLabel}
              </div>
            }
            content={
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {cityOptions.map((option, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={option.onClick}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            }
          />
        </div>

        <div className={clsx(dropdownWrapper(), className?.dropdownWrapper)}>
          <Dropdown
            trigger={
              <div className="w-full p-3 border border-gray-300 rounded-lg bg-white text-left">
                {selectedService || serviceDropdownLabel}
              </div>
            }
            content={
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {serviceOptions.map((option, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={option.onClick}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};