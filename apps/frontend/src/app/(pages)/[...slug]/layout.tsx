import { DefaultPageLayout } from "@components/layouts/DefaultPageLayout";
import { getPageBySlug } from "@lib/api/web/page";
import type { ReactNode } from "react";

type SlugLayoutProps = {
  children: ReactNode;
  params: Promise<{ slug: string[] }>;
};

export default async function SlugLayout({ children, params }: SlugLayoutProps) {
  const { slug } = await params;
  const pageData = await getPageBySlug({ pageUID: slug.join("/") });
  return (
    <DefaultPageLayout
      navbarVariant={pageData?.navbarVariant}
      footerVariant={pageData?.footerVariant}
    >
      {children}
    </DefaultPageLayout>
  );
}

