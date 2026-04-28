import type { FC } from "react";
import { BlockName } from "../strapi/modules";

export interface IBlockBuilder<T, V = never> {
  component: FC<V>;
  mapper: (data: T) => object;
}

export type BlockComponent = {
  [k in BlockName]: IBlockBuilder<never>;
};
