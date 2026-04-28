type AssistedAllowedSources =
  | "utm_source"
  | "utm_campaign"
  | "utm_medium"
  | "referrer";

type AssistedAllowedCustomerKey =
  | "full_name"
  | "first_name"
  | "last_name"
  | "document_type"
  | "document_number"
  | "phone"
  | "email";

type AssistedAllowedLocationKey =
  | "has_location"
  | "lat"
  | "lng"
  | "coordinates"
  | "city"
  | "raw_address"
  | "reference";

export type AssistedLeadSource = {
  [x in AssistedAllowedSources]: string | undefined;
};

type AssistedLeadCustomer = { terms_and_conditions: boolean } & {
  [x in Exclude<AssistedAllowedCustomerKey, "terms_and_conditions">]:
    | string
    | undefined;
};

type AssistedLeadLocation = {
  has_location?: boolean | undefined;
  lat?: number | string | undefined;
  lng?: number | string | undefined;
} & {
  [x in Exclude<AssistedAllowedLocationKey, "has_location" | "lat" | "lng">]:
    | string
    | undefined;
};

type AssistedLeadProduct = {
  product_name: string;
  product_price: number;
  product_code: string;
};

export type TAssistedLeadRequest = {
  channel: string;
  event_datetime: string;
  source: Partial<AssistedLeadSource>;
  terms_and_conditions: boolean;
  customer: Partial<AssistedLeadCustomer>;
  location: Partial<AssistedLeadLocation>;
  products: Partial<AssistedLeadProduct>[];
  interest?: string;
  notes?: string;
  origin?: string;
};

export type TAssistedLeadRequestPartial = Partial<TAssistedLeadRequest>;

export type TUpdateAssistedLeadPayload = Omit<
  TAssistedLeadRequest,
  "event_datetime" | "terms_and_conditions"
>;

export type TUpdateAssistedLeadRequest = Partial<TUpdateAssistedLeadPayload> & {
  id: string;
};

export type TSendAssistedLead = (
  req: TAssistedLeadRequestPartial
) => Promise<string>;

type AssistedLeadJsonResponseStatus = "sin_tipificar";
type AssistedLeadJsonReponseTypificationHistory = {
  typification_text: string;
  note: string | null;
  user: string | null;
  created_at: string;
  _id: string;
};

type TAssistedJsonResponseLead = {
  empresa: null;
  person: string;
  channel: string;
  source: Pick<AssistedLeadLocation, "reference">;
  status: AssistedLeadJsonResponseStatus;
  typification: unknown | null;
  typification_history: AssistedLeadJsonReponseTypificationHistory[];
  event_datetime: string;
  location: Pick<AssistedLeadLocation, "has_location">;
  logic: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type TAssistedJsonResponseData = {
  lead: TAssistedJsonResponseLead;
};

export type TAssistedLeadJsonResponse = {
  response: boolean;
  message: string;
  serverMessage?: string;
  data?: TAssistedJsonResponseData;
};
