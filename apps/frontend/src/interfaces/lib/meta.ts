export type TMetaDescription = {
  name: Key;
  value: string;
};

type Key =
  | "viewport"
  | "theme-color"
  | "apple-mobile-web-app-status-bar-style"
  | "mobile-web-app-capable"
  | "apple-mobile-web-app-title";
