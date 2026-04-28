import type { TwoColumnsWidth } from "@shared-ui/interfaces/twoColumns";

const NUMERIC_WIDTH_REGEX = /^\d+(\.\d+)?$/;
const VALID_WIDTH_REGEX = /^\d+(\.\d+)?(%|px|rem|vw)$/;
const CALC_WIDTH_REGEX = /^calc\(.+\)$/;
const HEX_COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export const DEFAULT_TWO_COLUMNS_DIVIDER_COLOR = "#B7B7B9";

const formatPercentage = (value: number): TwoColumnsWidth => {
  const roundedValue = Math.round(value * 1000) / 1000;
  return `${roundedValue}%` as TwoColumnsWidth;
};

const parsePercentage = (value?: string): number | undefined => {
  if (!value?.endsWith("%")) {
    return undefined;
  }

  const parsedValue = Number(value.slice(0, -1));
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
};

export const normalizeTwoColumnsWidth = (
  value?: string | null
): TwoColumnsWidth | undefined => {
  const normalizedValue = value?.trim();
  if (!normalizedValue) {
    return undefined;
  }

  if (NUMERIC_WIDTH_REGEX.test(normalizedValue)) {
    return `${normalizedValue}%` as TwoColumnsWidth;
  }

  if (VALID_WIDTH_REGEX.test(normalizedValue) || CALC_WIDTH_REGEX.test(normalizedValue)) {
    return normalizedValue as TwoColumnsWidth;
  }

  return undefined;
};

export const normalizeTwoColumnsWidths = (
  leftWidth?: string | null,
  rightWidth?: string | null
): { leftWidth?: TwoColumnsWidth; rightWidth?: TwoColumnsWidth } => {
  const normalizedLeftWidth = normalizeTwoColumnsWidth(leftWidth);
  const normalizedRightWidth = normalizeTwoColumnsWidth(rightWidth);

  const leftPercentage = parsePercentage(normalizedLeftWidth);
  const rightPercentage = parsePercentage(normalizedRightWidth);

  if (leftPercentage === undefined || rightPercentage === undefined) {
    return { leftWidth: normalizedLeftWidth, rightWidth: normalizedRightWidth };
  }

  const total = leftPercentage + rightPercentage;

  if (total <= 100) {
    return { leftWidth: normalizedLeftWidth, rightWidth: normalizedRightWidth };
  }

  const scaleFactor = 100 / total;

  return {
    leftWidth: formatPercentage(leftPercentage * scaleFactor),
    rightWidth: formatPercentage(rightPercentage * scaleFactor)
  };
};

export const sanitizeHexColor = (
  value?: string | null,
  fallback?: string
): string | undefined => {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    return fallback;
  }

  return HEX_COLOR_REGEX.test(normalizedValue) ? normalizedValue : fallback;
};
