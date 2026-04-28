export const mapListCardBlock = (data: any) => {
  return {
    title: data.title,
    cards: data.cards?.map((card: any) => ({
      title: card.title,
      items: card.items
    })) || []
  };
};
