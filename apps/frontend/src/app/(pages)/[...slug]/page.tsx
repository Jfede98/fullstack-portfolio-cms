import { TPageArgs } from "@interfaces/lib/pages";
import { buildPageSections } from "@lib/helpers/buildBlocks";
import { processDynamicMetadata } from "@lib/metadata/index";
import { fetchStructuredData } from "@lib/metadata/structuredData";
import StructuredData from "@components/structuredData";

export const generateMetadata = processDynamicMetadata;
const DynamicPages = async (args: TPageArgs) => {
  const { slug } = await args.params;
  const pageUID = slug.join("/");
  const [sections, structuredData] = await Promise.all([
    buildPageSections(pageUID),
    fetchStructuredData(pageUID)
  ]);

  return (
    <>
      <StructuredData data={structuredData} />
      {sections}
    </>
  );
};

export default DynamicPages;
