import type { IFormContactContext } from "@interfaces/context/formContact";
import { createContext } from "react";

export const FormContactContext = createContext<Partial<IFormContactContext>>({
  loading: false,
  data: undefined
});

export const { Provider, Consumer } = FormContactContext;
