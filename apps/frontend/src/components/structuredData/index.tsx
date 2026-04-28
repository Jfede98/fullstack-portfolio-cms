import Script from "next/script";
import type { TStructuredData } from "@interfaces/lib/strapi/modules";
import { headers } from "next/headers";
import type { FC } from "react";

const StructuredData: FC<{ data?: TStructuredData | null }> = async ({
  data
}) => {
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || "";
  const json = typeof data === "string" ? data : JSON.stringify(data);

  return (
    nonce && (
      <Script
        nonce={nonce}
        id="structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: json }}
      />
    )
  );
};

export default StructuredData;
