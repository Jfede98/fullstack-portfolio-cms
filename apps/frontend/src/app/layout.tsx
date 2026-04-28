import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@global-styles";
import { globalFonts } from "@lib/config/fonts";
import type { TProvider } from "@interfaces/provider";
import { headers } from "next/headers";
import { metaDescription } from "@lib/helpers/meta";
import { GoogleTagManager } from "@next/third-parties/google";
import { GTM_ID } from "@lib/constants/constants";
import { WhatsApp } from "@components/whatsapp";
import { RootLayoutProvider } from "@components/providers/layout";
import { ClientModal } from "@components/client/ClientModal";
import { processRootMetadata } from "@lib/metadata/index";

export const generateMetadata = processRootMetadata;

const RootLayout = async ({ children }: TProvider) => {
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || "";

  return (
    <html lang="es" nonce={nonce} suppressHydrationWarning>
      {metaDescription.map(({ name, value }, idx) => (
        <meta key={idx} name={name} content={value} />
      ))}
      {nonce && <GoogleTagManager nonce={nonce} gtmId={GTM_ID} />}
      <body className={`${globalFonts.join(" ")}`}>
        <RootLayoutProvider>
          {children}
          <WhatsApp />
          <ClientModal />
        </RootLayoutProvider>
      </body>
    </html>
  );
};

export default RootLayout;
