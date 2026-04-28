import type { NextConfig } from "next";

type RedirectConfig = NextConfig["redirects"];

const pagesRedirect: RedirectConfig = async () => [];

export const redirects: RedirectConfig = async () => {
  const pages = await pagesRedirect();
  return [...pages];
};
