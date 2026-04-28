export const generateSecureNonce = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString("base64");
};

export const normalizeHostname = (value: string): string => {
  try {
    return new URL(value).hostname;
  } catch {
    return value;
  }
};
