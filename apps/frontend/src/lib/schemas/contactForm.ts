import { boolean, object, type InferType } from "yup";
import {
  cedulaSchema,
  documentoSchema,
  telefonoSchema
} from "@lib/validations";

export const BasicFormSchema = object({
  cedula: cedulaSchema,
  phone: telefonoSchema
});

export type BasicFormData = InferType<typeof BasicFormSchema>;

export const DocumentFormSchema = object({
  document: documentoSchema,
  phone: telefonoSchema,
  privacy_policy: boolean()
});

export type TContactFormSchema = Record<string, string | boolean>;
