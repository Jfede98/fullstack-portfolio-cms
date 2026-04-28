export type TConstructSecrect = {
  label: string;
  value: string;
};

export interface TSecretConfig {
  name: string;
  description: string;
  secrets: TConstructSecrect[];
}
