import { type FC, useEffect, useRef, cloneElement, isValidElement } from "react";
import { DropdownStyle } from "./style";
import { type IDropdownProps } from "@shared-ui/interfaces/dropdown";
import { Icon } from "@shared-ui/components/icons";
import clsx from "clsx";
import { useDropdown } from "@shared-ui/hooks/useDropdown";

export const Dropdown: FC<IDropdownProps> = ({
  active: activeProp,
  className,
  trigger,
  content,
  contentPosition,
  hiddenArrowIcon = false,
  onActive,
  // Multi-select props
  multiSelect = false,
  selectedValues = [],
  onSelectionChange,
  options = [],
  placeholder = "Seleccionar..."
}) => {
  const { active, toggleActive, closeDropdown } = useDropdown({
    onActive,
    active: activeProp
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Multi-select handlers
  const handleOptionSelect = (option: string) => {
    if (!multiSelect || !onSelectionChange) return;
    
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter(v => v !== option)
      : [...selectedValues, option];
    
    onSelectionChange(newValues);
  };

  const removeSelectedValue = (valueToRemove: string) => {
    if (!onSelectionChange) return;
    onSelectionChange(selectedValues.filter(v => v !== valueToRemove));
  };

  const clearAllSelections = () => {
    if (!onSelectionChange) return;
    onSelectionChange([]);
  };

  // Multi-select trigger render
  const renderMultiSelectTrigger = () => {
    if (selectedValues.length === 0) {
      return (
        <div className="w-full p-3 border border-gray-300 rounded-lg bg-white text-left cursor-pointer flex items-center justify-between">
          <span className="text-gray-500">{placeholder}</span>
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${active ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      );
    }

    return (
      <div className="w-full p-2 border border-gray-300 rounded-lg bg-white cursor-pointer flex items-center justify-between">
        <div className="flex flex-wrap gap-1 flex-1">
          {selectedValues.map((value, index) => (
            <div key={index} className="bg-[#6E3279] text-white px-2 py-1 rounded text-sm flex items-center gap-1">
              <span>{value}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSelectedValue(value);
                }}
                className="hover:bg-[#5a2861] rounded-full w-4 h-4 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-2">
          {selectedValues.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearAllSelections();
              }}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Limpiar
            </button>
          )}
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${active ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  };

  // Multi-select content render
  const renderMultiSelectContent = () => {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
        {options.map((option, index) => {
          const isSelected = selectedValues.includes(option);
          return (
            <div
              key={index}
              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between ${
                isSelected ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              <span className={isSelected ? 'text-[#6E3279] font-medium' : 'text-gray-800'}>
                {option}
              </span>
              {isSelected && (
                <svg className="w-4 h-4 text-[#6E3279]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (active) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [active, closeDropdown]);

  const { base, wrapperTrigger, wrapperContent, wrapperIcon, contentInner } =
    DropdownStyle({
      active,
      contentPosition
    });

  // Use multi-select mode if enabled
  if (multiSelect) {
    return (
      <div className={clsx(base(), className?.base)} ref={dropdownRef}>
        <div
          className={clsx("w-full", className?.trigger)}
          onClick={toggleActive}
        >
          {renderMultiSelectTrigger()}
        </div>
        <div className={clsx(wrapperContent(), className?.content)}>
          <div className={contentInner()}>
            {active && renderMultiSelectContent()}
          </div>
        </div>
      </div>
    );
  }
  // Clone content and add onClick handlers to close dropdown
  const enhancedContent = isValidElement(content) 
    ? cloneElement(content, {
        onClick: (e: MouseEvent) => {
          // Close dropdown when clicking on content items
          if ((e.target as HTMLElement).closest('[data-dropdown-item]')) {
            closeDropdown();
          }
          // Call original onClick if it exists
          if ((content.props as any).onClick) {
            (content.props as any).onClick(e);
          }
        }
      } as any)
    : content;

  // Original dropdown mode
  return (
    <div className={clsx(base(), className?.base)} ref={dropdownRef}>
      <div
        className={clsx(wrapperTrigger(), className?.trigger)}
        onClick={toggleActive}
      >
        <div className="w-full flex items-center justify-between">
          <div className="flex-1">{trigger}</div>
          {!hiddenArrowIcon && (
            <Icon
              name="keyboard_arrow_down"
              size="sm"
              type="rounded"
              className={{ base: wrapperIcon() }}
            />
          )}
        </div>
      </div>
      <div className={clsx(wrapperContent(), className?.content)}>
        <div className={contentInner()}>{active && enhancedContent}</div>
      </div>
    </div>
  );
};
