import { DefaultPageLayout } from "@components/layouts/DefaultPageLayout";
import { getPageBySlug } from "@lib/api/web/page";
import { PageType } from "@lib/constants/state";
import type { TProvider } from "@interfaces/provider";

export default async function HomeLayout({ children }: TProvider) {
  const pageData = await getPageBySlug({ pageUID: PageType.HOME });
  return (
    <DefaultPageLayout
      navbarVariant={pageData?.navbarVariant}
      footerVariant={pageData?.footerVariant}
    >
      {children}
    </DefaultPageLayout>
  );
}

