export const isExternalHref = (href?: string): boolean =>
  Boolean(href && /^https?:\/\//i.test(href));
