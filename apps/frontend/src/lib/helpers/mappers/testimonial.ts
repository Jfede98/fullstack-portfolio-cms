import type {
  IPlanCarouselButton,
  IPlanCarouselProps,
  IPlanCarouselTestimonial
} from "@interfaces/planCarousel";
import type {
  StrapiTestimonial,
  StrapiTestimonialSection
} from "@interfaces/components/testimonial";
import type { StrapiButton } from "@interfaces/lib/strapi/strapi";
import { mapTypography } from "./utils";
import { mapButton } from "./button";

const normalizeRating = (rating?: string | number | null): number => {
  const parsed =
    typeof rating === "number"
      ? rating
      : Number.parseFloat(String(rating).trim().replace(",", "."));

  return Number.isNaN(parsed) ? 0 : parsed;
};

const normalizeCarouselVariant = (
  color: unknown
): IPlanCarouselButton["variant"] => {
  if (color === "secondary" || color === "tertiary") return color;
  return "primary";
};

const mapCarouselButton = (
  data?: StrapiButton | null
): IPlanCarouselButton | undefined => {
  const mapped = mapButton(data);
  if (!mapped?.children) return undefined;

  return {
    label: String(mapped.children),
    size: "lg",
    variant: normalizeCarouselVariant(mapped.color),
    identifier: mapped.identifier,
    leadFormSelection: mapped.leadFormSelection,
    href: mapped.href,
    target: mapped.target
  };
};

const mapTestimonialItem = (
  item: StrapiTestimonial,
  index: number
): IPlanCarouselTestimonial | null => {
  const text = item.review ?? "";
  const author = item.author ?? "";
  const rating = normalizeRating(item.rating);

  if (!text && !author && rating === 0) return null;

  return {
    id: item.id ?? index,
    author,
    text,
    rating
  };
};

export const mapTestimonial = (
  data: StrapiTestimonialSection
): IPlanCarouselProps => {
  const testimonials = (data?.testimonials ?? [])
    .filter(Boolean)
    .map((item, index) => mapTestimonialItem(item as StrapiTestimonial, index))
    .filter(Boolean) as IPlanCarouselTestimonial[];

  const features = data?.features
    ?.map((feature) => {
      const iconName = Array.isArray(feature?.icon)
        ? (feature?.icon?.[0]?.name ?? undefined)
        : (feature?.icon?.name ?? undefined);

      if (!iconName) return undefined;

      return {
        icon: iconName,
        title: feature?.name ?? "",
        description: feature?.description ?? ""
      };
    })
    .filter(Boolean) as IPlanCarouselProps["features"];

  return {
    title: data?.title ? mapTypography(data.title) : { text: "" },
    description: data?.description ?? "",
    button: mapCarouselButton(data?.ctaButton),
    testimonials,
    features: features ?? []
  };
};
