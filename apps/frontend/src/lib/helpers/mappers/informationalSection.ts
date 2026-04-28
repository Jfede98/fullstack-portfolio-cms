import type {
  IInformationalSection,
  StrapiInformationalSection
} from "@interfaces/components/informationalSection";
import { mapTypography, mapUrlMedia } from "./utils";
import { mapButton } from "./button";

export const mapInformationalSection = (
  data: StrapiInformationalSection
): IInformationalSection => {
  const mappedButton = mapButton(data.button);
  const imageUrl = mapUrlMedia(data.image);

  return {
    title: data?.title?.text ? mapTypography(data.title) : { text: "" },
    subtitle: data.subtitle ? mapTypography(data.subtitle) : undefined,
    description: data.description ?? "",
    cta: mappedButton ?? undefined,
    image: {
      src: imageUrl ?? "",
      alt: data.image?.alternativeText ?? ""
    }
  };
};


