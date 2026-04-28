import { ReactNode } from 'react';

export interface IProviderProps {
  children: ReactNode;
}

export type TProvider = Readonly<IProviderProps>;
