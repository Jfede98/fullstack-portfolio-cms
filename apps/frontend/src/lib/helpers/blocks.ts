import { TestimonialCarousel } from "@components/testimonialCarousel";
import type { BlockComponent } from "@interfaces/lib/blocks/block";
import { mapTestimonial } from "./mappers/testimonial";
import { Widget } from "@components/widget";
import { mapWidget } from "./mappers/widget";
import { mapperForm } from "./mappers/form";
import { Hero } from "@components/hero";
import { mapHero } from "./mappers/hero";
import { CtaBanner } from "@components/ctaBanner";
import { mapCtaBanner } from "./mappers/ctaBanner";
import { PlanTab } from "@components/planTab";
import { mapPlanTab } from "./mappers/planTab";
import { FormBlock } from "@components/forms/contact/block";
import { Features } from "@components/features";
import { mapFeatures } from "./mappers/features";
import { ServiceChannels } from "@components/serviceChannels";
import { mapServiceChannels } from "./mappers/serviceChannels";
import { ComparativeTable } from "@components/comparativeTable";
import { mapComparativeTable } from "./mappers/comparativeTable";
import { StreamingPlans } from "@components/streamingPlans";
import { mapStreamingPlans } from "@lib/helpers/mappers/streamingPlans";
import { InfoCardBlock } from "@components/infoCardBlock";
import { mapInfoCardBlock } from "./mappers/infoCardBlock";
import { ListCardBlock } from "@components/listCardBlock";
import { mapListCardBlock } from "./mappers/listCardBlock";
import { ContactFormBlock } from "@components/contactFormBlock";
import { mapContactFormBlock } from "./mappers/contactFormBlock";
import { LinkBlock } from "@components/linkBlock";
import { mapLinkBlock } from "./mappers/linkBlock";
import { TwoColumnsBlock } from "@components/twoColumns";
import { mapTwoColumns } from "./mappers/twoColumns";
import { InformationalSection } from "@components/informationalSection";
import { mapInformationalSection } from "./mappers/informationalSection";
import { MapBlock } from "@components/map";
import { mapMap } from "./mappers/map";
import { CentersPageBlock } from "@components/centersPageBlock";
import { mapCentersPageBlock } from "./mappers/centersPageBlock";
import { DualButtonsBlock } from "@components/dualButtons";
import { mapDualButtons } from "./mappers/dualButtons";
import { BannerLinkBlock } from "@components/bannerLinkBlock";
import { mapBannerLinkBlock } from "./mappers/bannerLinkBlock";
import { FaqsBlock } from "@components/faqsBlock";
import { mapFaqs } from "./mappers/faqs";

export const PageBlock: BlockComponent = {
  "block.widget": {
    component: Widget,
    mapper: mapWidget
  },
  "block.testimonials": {
    component: TestimonialCarousel,
    mapper: mapTestimonial
  },
  "block.form": {
    component: FormBlock,
    mapper: mapperForm
  },
  "block.hero": {
    component: Hero,
    mapper: mapHero
  },
  "block.cta-banner": {
    component: CtaBanner,
    mapper: mapCtaBanner
  },
  "block.plan-tab": {
    component: PlanTab,
    mapper: mapPlanTab
  },
  "block.features": {
    component: Features,
    mapper: mapFeatures
  },
  "block.two-columns": {
    component: TwoColumnsBlock,
    mapper: mapTwoColumns
  },
  "block.service-channels": {
    component: ServiceChannels,
    mapper: mapServiceChannels
  },
  "block.comparative-table": {
    component: ComparativeTable,
    mapper: mapComparativeTable
  },
  "block.streaming-plans": {
    component: StreamingPlans,
    mapper: mapStreamingPlans
  },
  "block.info-card-block": {
    component: InfoCardBlock,
    mapper: mapInfoCardBlock
  },
  "block.list-card-block": {
    component: ListCardBlock,
    mapper: mapListCardBlock
  },
  "block.contact-form-block": {
    component: ContactFormBlock,
    mapper: mapContactFormBlock
  },
  "block.link-block": {
    component: LinkBlock,
    mapper: mapLinkBlock
  },
  "block.informational-section": {
    component: InformationalSection,
    mapper: mapInformationalSection
  },
  "block.map": {
    component: MapBlock,
    mapper: mapMap
  },
  "block.centers-page-block": {
    component: CentersPageBlock,
    mapper: mapCentersPageBlock
  },
  "block.dual-buttons": {
    component: DualButtonsBlock,
    mapper: mapDualButtons
  },
  "block.banner-link-block": {
    component: BannerLinkBlock,
    mapper: mapBannerLinkBlock
  },
  "block.fa-qs": {
    component: FaqsBlock,
    mapper: mapFaqs
  }
}
