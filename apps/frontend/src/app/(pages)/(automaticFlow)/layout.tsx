import type { TProvider } from "@interfaces/provider";
import { AutomaticFlowLayout } from "@components/layouts/AutomaticFlowLayout";

export default function SemiautomaticLayout({ children }: TProvider) {
  return <AutomaticFlowLayout>{children}</AutomaticFlowLayout>;
}

