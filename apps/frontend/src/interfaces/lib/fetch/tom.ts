export type TomGestorLeadsTokenResponse = Data & {
  response: boolean;
  message: string;
  serverMessage: string;
  data?: Data;
};

export type Data = {
  access_token: string;
  expires_in: number;
  scope: string;
};

export type FetchingTokenRequest = {
  grant_type: string;
  client_id: string;
  client_secret: string;
};

export type TomGestorLeadGetToken = () => Promise<string>;
