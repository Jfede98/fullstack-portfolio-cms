import { PageType } from "@lib/constants/state";
import { buildPageSections } from "@lib/helpers/buildBlocks";
import { fetchStructuredData } from "@lib/metadata/structuredData";
import StructuredData from "@components/structuredData";
import { processHomeMetadata } from "@lib/metadata/index";

export const generateMetadata = processHomeMetadata;
const Home = async () => {
  const [sections, structuredData] = await Promise.all([
    buildPageSections(PageType.HOME),
    fetchStructuredData(PageType.HOME)
  ]);

  return (
    <>
      <StructuredData data={structuredData} />
      {sections}
    </>
  );
};

export default Home;
