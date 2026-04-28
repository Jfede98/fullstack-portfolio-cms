export type TScreens = "msm" | "sm" | "md" | "lg" | "xl" | "xxl";
export type TFonts = "xtr";

export type TObjectScreens<T> = Record<TScreens, T>;
export type TObjectFonts = Record<TFonts, string[]>;
