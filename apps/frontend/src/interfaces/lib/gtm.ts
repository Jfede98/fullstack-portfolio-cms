type ArgsKey =
  | "event"
  | "flow"
  | "step"
  | "section"
  | "elementDescription"
  | "ph"
  | "em"
  | "fn"
  | "ln"
  | "ct"
  | "country"
  | "idTransaction";

export type TGtmItem = {
  item_id: string;
  item_name: string;
  item_category: string;
  brand: string;
  price: string;
  quantity: number;
};

export type TGtmEvent = { item?: TGtmItem[] } & Partial<{
  [event in ArgsKey]: string;
}>;

export type TGtmEventHandler = (data: TGtmEvent) => void;
