import { generateCSPHeader } from "@lib/config/next/csp";
import { generateSecureNonce } from "@lib/config/next/utils";
import { NextResponse } from "next/server";

const proxy = async () => {
  const nonce = generateSecureNonce();
  const csp = await generateCSPHeader(nonce);

  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("x-nonce", nonce);
  return response;
};
export const config = {
  matcher: [
    "/((?!api|_next|\\.next|static|manifest|assets|robots|favicon\\.ico|(?:[a-zA-Z-]+/)?sitemap\\.xml).*)"
  ]
};
export default proxy;
