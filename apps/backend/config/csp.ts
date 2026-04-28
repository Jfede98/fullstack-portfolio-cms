const parseList = (value?: string, fallback: string[] = []) =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .concat(fallback)
    .filter((item, index, arr) => arr.indexOf(item) === index);

const cloudfrontUrl = process.env.CLOUDFRONT_URL?.trim();

const imgAndMediaSources = parseList(process.env.CSP_IMG_MEDIA_SRC, [
  "'self'",
  "data:",
  "blob:",
  "https://market-assets.strapi.io",
  "https://statics.dathaplus.com",
  "https://d1qxy6iu9tbe58.cloudfront.net",
  "https://d1h9itrwoo1c3o.cloudfront.net",
  "https://d16p3wjdz98n33.cloudfront.net",
  "https://d1zbh0zoyx3qgr.cloudfront.net",
  ...(cloudfrontUrl ? [cloudfrontUrl] : [])
]);

const csp = {
  useDefaults: true,
  directives: {
    "default-src": ["'self'"],
    "base-uri": ["'self'"],
    "object-src": ["'none'"],
    "script-src": parseList(process.env.CSP_SCRIPT_SRC, [
      "'self'",
      "https://unlayer.com",
      "https://editor.unlayer.com"
    ]),
    "style-src": parseList(process.env.CSP_STYLE_SRC, [
      "'self'",
      "'unsafe-inline'"
    ]),
    "img-src": imgAndMediaSources,
    "media-src": imgAndMediaSources,
    "connect-src": parseList(process.env.CSP_CONNECT_SRC, ["'self'", "https:"]),
    "font-src": parseList(process.env.CSP_FONT_SRC, [
      "'self'",
      "https:",
      "data:"
    ]),
    "frame-src": parseList(process.env.CSP_FRAME_SRC, [
      "'self'",
      "https://unlayer.com",
      "https://editor.unlayer.com"
    ]),
    "frame-ancestors": parseList(process.env.CSP_FRAME_ANCESTORS, ["'self'"]),
    "form-action": ["'self'"],
    "script-src-attr": ["'none'"],
    upgradeInsecureRequests: null
  }
};

export default csp;
