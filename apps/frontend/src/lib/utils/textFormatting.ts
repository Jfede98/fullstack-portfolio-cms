import { createElement, Fragment } from "react";

export interface FormatTextWithBreakOptions {
  /**
   * Texto a formatear
   */
  text: string;
}

/**
 * Encuentra el índice del espacio más cercano al punto medio del texto.
 * Esto permite dividir el texto de manera más equilibrada considerando la longitud.
 */
const findOptimalBreakPoint = (text: string): number => {
  const textLength = text.length;
  const midpoint = Math.floor(textLength / 2);
  
  // Buscar espacios alrededor del punto medio
  const spaces: number[] = [];
  for (let i = 0; i < textLength; i++) {
    if (text[i] === " ") {
      spaces.push(i);
    }
  }

  if (spaces.length === 0) return -1;

  // Encontrar el espacio más cercano al punto medio
  let closestIndex = spaces[0];
  let minDistance = Math.abs(spaces[0] - midpoint);

  for (const spaceIndex of spaces) {
    const distance = Math.abs(spaceIndex - midpoint);
    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = spaceIndex;
    }
  }

  return closestIndex;
};

/**
 * Formatea un texto para mostrarlo con saltos de línea en móvil y en una línea en desktop.
 * La división se basa en la longitud de caracteres, dividiendo en el espacio más cercano al punto medio.
 * 
 * @example
 * formatTextWithMobileBreak({ text: "Fibra Óptica" })
 * // → "Fibra" (móvil) / "Óptica" (móvil) | "Fibra Óptica" (desktop)
 * 
 * @example
 * formatTextWithMobileBreak({ text: "interesados por aquí" })
 * // → "interesados" (móvil) / "por aquí" (móvil) | "interesados por aquí" (desktop)
 */
export const formatTextWithMobileBreak = (
  options: FormatTextWithBreakOptions
): React.ReactNode => {
  const { text } = options;

  if (!text || typeof text !== "string") return text;

  const words = text.trim().split(/\s+/).filter(Boolean);

  // Casos edge: texto vacío o una sola palabra
  if (words.length <= 1) return text;

  // Dividir en el espacio más cercano al punto medio (por longitud de caracteres)
  const breakIndex = findOptimalBreakPoint(text);
  if (breakIndex === -1) {
    // No hay espacios, retornar texto completo
    return text;
  }

  const firstLine = text.substring(0, breakIndex).trim();
  const secondLine = text.substring(breakIndex + 1).trim();

  return createElement(
    Fragment,
    null,
    createElement("span", { className: "md:hidden" }, firstLine),
    createElement("br", { className: "md:hidden" }),
    createElement("span", { className: "md:hidden" }, secondLine),
    createElement("span", { className: "hidden md:inline" }, text)
  );
};
