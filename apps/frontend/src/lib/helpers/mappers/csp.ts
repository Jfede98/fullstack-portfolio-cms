import type { TNextConfig } from "@interfaces/lib/next";

type TCSPolicy = TNextConfig.TCSPolicy;

const replaceNonce = (value: string, nonce: string): string =>
  value.replaceAll("{nonce}", `'nonce-${nonce}'`);

export const mapCspPolicies = (
  policies: TCSPolicy[],
  csp: Record<string, string[]>,
  nonce: string
): TCSPolicy[] =>
  policies.map((policy) => {
    const value = csp[policy.key];
    if (!value) return policy;
    return {
      ...policy,
      value: value.map((entry) => replaceNonce(entry, nonce))
    };
  });
