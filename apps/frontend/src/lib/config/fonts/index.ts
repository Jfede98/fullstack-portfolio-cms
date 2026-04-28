import localFont from "next/font/local";

export const ubuntu = localFont({
  preload: true,
  variable: "--font-xtr",
  display: "swap",
  fallback: ["ubuntu", "sans-serif"],
  src: [
    {
      path: "/Ubuntu/light.woff2",
      weight: "300",
      style: "light"
    },
    {
      path: "/Ubuntu/regular.woff2",
      weight: "400",
      style: "normal"
    },
    {
      path: "/Ubuntu/medium.woff2",
      weight: "500",
      style: "bold"
    }
  ]
});

export const icons = localFont({
  preload: true,
  variable: "--font-icons",
  display: "swap",
  fallback: ["icons", "sans-serif"],
  src: [
    {
      path: "/MaterialUI/outlined.woff2",
      weight: "300",
      style: "light"
    },
    {
      path: "/MaterialUI/rounded.woff2",
      weight: "400",
      style: "normal"
    },
    {
      path: "/MaterialUI/filled.woff2",
      weight: "500",
      style: "bold"
    }
  ]
});

export const globalFonts = [ubuntu.variable, icons.variable];
