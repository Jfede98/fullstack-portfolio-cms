import * as Yup from "yup";
import { validarCedula, validarCedulaORUC } from "./identification";

export const cedulaSchema = Yup.string()
  .required("La cédula es requerida")
  .test(
    "cedula-valida",
    "Cédula inválida. Debe ser una cédula ecuatoriana válida de 10 dígitos",
    (value: string | undefined) => {
      return validarCedula(String(value));
    }
  );

export const documentoSchema = Yup.string()
  .required("El número de documento es requerido")
  .test(
    "documento-valido",
    "Debe ingresar una cédula válida (10 dígitos) o RUC válido (13 dígitos)",
    (value: string | undefined) => {
      const resultado = validarCedulaORUC(String(value));
      return resultado.valido;
    }
  );

export const telefonoSchema = Yup.string()
  .required("El teléfono es requerido")
  .matches(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos")
  .test(
    "telefono-formato",
    "El teléfono debe comenzar con 0",
    (value: string | undefined) => {
      return String(value).startsWith("0");
    }
  );

export const emailSchema = Yup.string()
  .required("El correo electrónico es requerido")
  .email("Ingresa un correo electrónico válido");

export const numberSchema = Yup.string()
  .required("Este campo NUMBER es requerido")
  .matches(/^\d+$/, "Solo se permiten números");

export const textSchema = Yup.string()
  .required("Este campo TEXT es requerido");

export const idCardSchema = Yup.string()
  .required("El número de documento es requerido")
  .test(
    "idcard-valido",
    "Debe ingresar una cédula válida (10 dígitos) o RUC válido (13 dígitos)",
    (value: string | undefined) => {
      const resultado = validarCedulaORUC(String(value));
      return resultado.valido;
    }
  );

export const fingerprintCodeSchema = Yup.string()
  .required("El código dactilar es requerido")
  .matches(
    /^[A-Z][0-9]{4}[A-Z][0-9]{4}$/,
    "Ingresa el código dactilar como aparece en tu cédula. Ejemplo: D1234N5678"
  );

export const schemaByType: Record<string, Yup.StringSchema> = {
  email:           emailSchema,
  number:          numberSchema,
  tel:             telefonoSchema,
  idCard:          idCardSchema,
  fingerprintCode: fingerprintCodeSchema,
  text:            textSchema,
};

export type StrapiInputTypeSchema = typeof schemaByType;
