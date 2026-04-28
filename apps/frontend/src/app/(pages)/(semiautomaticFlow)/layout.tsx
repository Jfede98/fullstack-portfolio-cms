import { SemiautomaticFlowLayout } from "@components/layouts/SemiautomaticFlowLayout";
import type { TProvider } from "@interfaces/provider";

export default function SemiautomaticLayout({ children }: TProvider) {
  return <SemiautomaticFlowLayout>{children}</SemiautomaticFlowLayout>;
}

