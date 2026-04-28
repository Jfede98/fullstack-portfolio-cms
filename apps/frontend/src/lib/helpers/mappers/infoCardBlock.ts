import { mapUrlMedia } from "./utils";

export const mapInfoCardBlock = (data: any, isFirstBlock: boolean = false) => {
  return {
    title: data.title,
    description: data.description,
    cards: data.cards?.map((card: any) => ({
      image: mapUrlMedia(card.image),
      imageAlt: card.imageAlt || card.title,
      title: card.title,
      description: card.description
    })) || [],
    isFirstBlock
  };
};
