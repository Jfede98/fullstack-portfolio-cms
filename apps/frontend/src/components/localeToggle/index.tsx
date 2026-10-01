"use client";

import type { FC } from "react";
import { useLocale } from "@context/locale";

interface ILocaleToggleProps {
  className?: string;
}

export const LocaleToggle: FC<ILocaleToggleProps> = ({ className }) => {
  const { locale, setLocale } = useLocale();

  return (
    <div
      className={`flex items-center gap-1 rounded-full border border-gray-200 p-0.5 text-sm font-medium ${className ?? ""}`}
      role="group"
      aria-label="Select language"
      data-testid="locale-toggle"
    >
      <button
        type="button"
        onClick={() => setLocale("es")}
        aria-pressed={locale === "es"}
        className={[
          "rounded-full px-3 py-1 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          locale === "es"
            ? "bg-gray-900 text-white"
            : "text-gray-500 hover:text-gray-800"
        ].join(" ")}
        data-testid="locale-toggle-es"
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={[
          "rounded-full px-3 py-1 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          locale === "en"
            ? "bg-gray-900 text-white"
            : "text-gray-500 hover:text-gray-800"
        ].join(" ")}
        data-testid="locale-toggle-en"
      >
        EN
      </button>
    </div>
  );
};
