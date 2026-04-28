import type { TId, TTimestamps, TDocumentId } from "@interfaces/lib/strapi/modules";
import type { TBlockCallToAction } from "./callToAction";

type Testimonial = TId &
  TTimestamps & {
    documentId: TDocumentId;
    author: string;
    review: string | null;
    rating: number;
  };

export type TBlockTestimonial = {
  title: string;
  description: string;
  ctaButton: TBlockCallToAction;
  testimonials: Testimonial[];
};
