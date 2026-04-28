import { getContentSecurityPolicy } from "@lib/api/web/csp";
import { mapCspPolicies } from "@lib/helpers/mappers/csp";

export const generateCSPHeader = async (nonce: string): Promise<string> => {
  const csp = await getContentSecurityPolicy();
  const policies = mapCspPolicies(
    Object.entries(csp).map(([key, value]) => ({ key, value })),
    csp,
    nonce
  );

  return policies
    .map(({ key, value }) => `${key} ${value.join(" ")}`)
    .join(";");
};
