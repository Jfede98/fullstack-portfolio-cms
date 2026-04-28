import { ModalContext } from "@context/modal";
import { useCustomPathname } from "@hooks/useCustomPathname";
import { useGtm } from "@hooks/useGtm";
import { useMatchMedia } from "@sitio-publico/shared-ui";
import type { IFormContactContext } from "@interfaces/context/formContact";
import type { ICoverageFormProps, ILeadFormSelection } from "@interfaces/coverageForm";
import type { IPlanCardData } from "@interfaces/components/planTab";
import { sendAssistedLead } from "@lib/api/leads/assisted";
import { dispatchLeadEmail } from "@lib/api/leads/distribution";
import {
  AssistedLeadErrorCode,
  FormContactInputType,
  MutationKey,
  RenderModalType
} from "@lib/constants/state";
import { useAppDispatch, useAppSelector } from "@store/semiautomaticFlow/hooks";
import { setLeadData, setSelectedPlan } from "@store/semiautomaticFlow";
import { useRouter } from "next/navigation";
import { TContactFormSchema } from "@lib/schemas/contactForm";
import { boolean, object, string } from "yup";
import { documentoSchema, telefonoSchema, schemaByType } from "@lib/validations";
import { getUtmSource } from "@lib/utils/utms";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useCallback, useContext, useRef, useState, useEffect } from "react";
import { IPlanCardProps } from "@sitio-publico/shared-ui";
import { ValidationError } from "yup";

const FALLBACK_TOM_CHANNEL = "69a8638bd56833833dcad398";

type TFormStatus = "success" | "error" | "duplicated" | null;
type TDistributionMode = "email" | "tom" | "both";
type TFormikErrors = Record<string, string>;
const DEFAULT_PRIVACY_FIELD = "privacy_policy";

const getPrivacyFieldName = (form?: ICoverageFormProps): string =>
  String(form?.privacyCheckbox?.name ?? DEFAULT_PRIVACY_FIELD).trim() ||
  DEFAULT_PRIVACY_FIELD;

export const mapValidationErrors = (error: ValidationError): TFormikErrors => {
  if (error.inner?.length > 0) {
    return error.inner.reduce((acc: TFormikErrors, item) => {
      if (item.path) acc[item.path] = item.message;
      return acc;
    }, {});
  }

  if (error.path) return { [error.path]: error.message };
  return {};
};

const getStringValue = (
  values: TContactFormSchema,
  ...keys: string[]
): string => {
  for (const key of keys) {
    const value = values[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
};

export const useContactForm = (): IFormContactContext => {
  const pathname = useCustomPathname();
  const { addEvent } = useGtm();
  const { isDesktop } = useMatchMedia();
  const { state, handlerState, handlerModalType } = useContext(ModalContext);
  const dispatch = useAppDispatch();
  const selectedPlanFromStore = useAppSelector(
    (state) => state.semiautomaticFlow.selectedPlan
  );
  const router = useRouter();
  const [data, setFormData] = useState<ICoverageFormProps | undefined>();
  const dataRef = useRef<ICoverageFormProps | undefined>(undefined);
  const [leadSelection, setLeadSelectionState] = useState<
    ILeadFormSelection | undefined
  >(undefined);
  const leadSelectionRef = useRef<ILeadFormSelection | undefined>(undefined);
  const [section, setSection] = useState<string>();
  const [plan, setPlan] = useState<IPlanCardProps | undefined>();
  const [statusType, setStatusType] = useState<TFormStatus>(null);
  const lastDocumentNumberRef = useRef<string>("");
  const utmSourceRef = useRef<ReturnType<typeof getUtmSource> | null>(null);
  const resetFormRef = useRef<() => void>(() => {});
  const navigateAfterSuccessRef = useRef<() => boolean>(() => false);
  const successActionRef = useRef<(() => boolean | void) | null>(null);

  const handlerData = (data: ICoverageFormProps) => {
    setFormData(data);
    dataRef.current = data;
  };

  const setLeadSelection = (selection?: ILeadFormSelection) => {
    leadSelectionRef.current = selection;
    setLeadSelectionState(selection);
  };

  const setOnSuccessAction = useCallback(
    (action?: (() => boolean | void) | null) => {
      successActionRef.current = action ?? null;
    },
    []
  );

  useEffect(() => {
    utmSourceRef.current = getUtmSource();
  }, []);

  const openStatusModal = useCallback(
    (nextStatus: Exclude<TFormStatus, null>) => {
      if (nextStatus === "success") {
        resetFormRef.current();
        if (successActionRef.current?.()) {
          handlerState(false);
          return;
        }
        // LEGACY: before the embedded automatic checkout existed, automaticFlow
        // success redirected to /checkout. Keep this fallback until the old
        // journey is removed.
        if (navigateAfterSuccessRef.current()) {
          handlerState(false);
          return;
        }
      }
      setStatusType(nextStatus);
      handlerModalType?.(RenderModalType.CONTACT_FORM_STATUS);
      handlerState(true);
    },
    [handlerModalType, handlerState]
  );

  const formGtmEvent = useCallback(
    (idTransaction: string, phone?: string) => {
      const sectionBlock = !isDesktop ? "banner-body" : "banner-header";
      const newSection = !state ? sectionBlock : section;

      addEvent({
        section: newSection,
        event: "generate_lead",
        flow: pathname,
        elementDescription: "generar_lead",
        idTransaction,
        ph: phone,
        item: plan
          ? [
              {
                item_id: plan?.id ?? "",
                item_name: plan?.name ?? "",
                item_category: plan?.speedUnit ?? "",
                brand: "plan",
                price: plan?.priceInfo?.amount?.replace("*", "") ?? "",
                quantity: 1
              }
            ]
          : undefined
      });
    },
    [addEvent, section, pathname, isDesktop, state, plan]
  );

  const { mutateAsync, isPending: loading } = useMutation({
    mutationKey: [
      MutationKey.FORMS,
      MutationKey.ASSISTED_LEAD,
      MutationKey.CONTACT_FORM
    ],
    mutationFn: sendAssistedLead,
    onSuccess: (response) => {
      if (!response) {
        openStatusModal("error");
        return;
      }

      if (response.success) {
        dispatch(
          setLeadData({
            leadId: response.id ?? "",
            phone: response.phone ?? "",
            documentNumber: lastDocumentNumberRef.current
          })
        );
        if (plan) dispatch(setSelectedPlan(plan as unknown as IPlanCardData));
        if (response.id) formGtmEvent(response.id, response.phone);
      }

      const nextStatus = response.success
        ? "success"
        : response.errorCode === AssistedLeadErrorCode.DUPLICATE
          ? "duplicated"
          : "error";

      openStatusModal(nextStatus);

      if (response?.id) formGtmEvent(response.id, response?.phone);
    },
    onError: (error) => {
      console.error("error | sendAssistedLead", error);
      openStatusModal("error");
    }
  });

  const initialValues: TContactFormSchema = {
    [DEFAULT_PRIVACY_FIELD]: false
  } as TContactFormSchema;

  const validate = useCallback(async (values: TContactFormSchema) => {
    const inputs = dataRef.current?.inputs ?? [];
    const privacyRequired = dataRef.current?.privacyCheckbox?.required ?? false;
    const privacyFieldName = getPrivacyFieldName(dataRef.current);

    const fallbackSchema = inputs.length === 0
      ? object({
          document: documentoSchema,
          phone: telefonoSchema,
          [privacyFieldName]: privacyRequired
            ? boolean().required("Debes aceptar para continuar").oneOf([true], "Debes aceptar para continuar")
            : boolean().optional()
        })
      : object({
          ...Object.fromEntries(
            inputs
              .filter((inp) => inp.type !== "combobox" && inp.name)
              .map((inp) => {
                const name = inp.name === FormContactInputType.CEDULA || inp.name === FormContactInputType.RUC
                  ? FormContactInputType.DOCUMENT
                  : inp.name!;
                if (!inp.required) return [name, string().optional().default("")];
                return [name, schemaByType[inp.type ?? ""] ?? documentoSchema];
              })
          ),
          [privacyFieldName]: privacyRequired
            ? boolean().required("Debes aceptar para continuar").oneOf([true], "Debes aceptar para continuar")
            : boolean().optional()
        });

    try {
      await fallbackSchema.validate(values, { abortEarly: false });
      return {};
    } catch (error) {
      if (error instanceof ValidationError) return mapValidationErrors(error);
      return {};
    }
  }, []);

  const generateLead = useCallback(
    (values: TContactFormSchema) => {
      const privacyFieldName = getPrivacyFieldName(dataRef.current);
      const doc = String(
        values[FormContactInputType.DOCUMENT] ??
          values[FormContactInputType.CEDULA] ??
          ""
      ).trim();
      const phone = String(values[FormContactInputType.PHONE] ?? "").trim();
      const email = getStringValue(values, FormContactInputType.EMAIL, "email");
      const city = String(values.city ?? "").trim();
      const fullName =
        getStringValue(values, "full_name", "name") || `formulario_${pathname}`;
      const productName = String(values.product_name ?? "").trim();
      const channel = String(leadSelection?.channel ?? "").trim() || FALLBACK_TOM_CHANNEL;
      const isRuc = doc.length === 13;
      const resolvedPlan = plan ?? selectedPlanFromStore;

      const products = productName
        ? [{ product_name: productName }]
        : resolvedPlan
          ? [
              {
                product_name: resolvedPlan.name ?? "",
                product_price: Number(
                  resolvedPlan.priceInfo?.amount
                    ?.replace("*", "")
                    .replace("$", "")
                    .replace(",", ".") ?? ""
                ),
                product_code: String(
                  resolvedPlan.id ??
                    ("identifier" in resolvedPlan
                      ? resolvedPlan.identifier
                      : undefined) ??
                    resolvedPlan.name ??
                    ""
                )
              }
            ]
          : undefined;

      return {
        channel,
        event_datetime: new Date().toISOString(),
        source: utmSourceRef.current ?? getUtmSource(),
        customer: {
          full_name: fullName,
          document_number: doc,
          document_type: !isRuc
            ? FormContactInputType.CEDULA
            : FormContactInputType.RUC,
          phone: phone,
          email: email || undefined
        },
        location: {
          has_location: false,
          city,
          raw_address: "",
          reference: ""
        },
        terms_and_conditions: Boolean(values[privacyFieldName as keyof TContactFormSchema]),
        products
      };
    },
    [leadSelection?.channel, plan, selectedPlanFromStore]
  );

  const buildLeadData = useCallback((values: TContactFormSchema) => {
    const inputs = dataRef.current?.inputs ?? [];
    const privacyFieldName = getPrivacyFieldName(dataRef.current);

    if (!inputs.length) {
      return Object.entries(values).reduce(
        (acc: Record<string, unknown>, [key, value]) => {
          if (key === DEFAULT_PRIVACY_FIELD || key === privacyFieldName) return acc;
          acc[key] = value == null ? "" : String(value);
          return acc;
        },
        {}
      );
    }

    return inputs.reduce((acc: Record<string, unknown>, input) => {
      if (!input?.name) return acc;
      const sourceKey =
        input.name === FormContactInputType.CEDULA ||
        input.name === FormContactInputType.RUC
          ? FormContactInputType.DOCUMENT
          : input.name;
      const value = values[sourceKey as keyof TContactFormSchema];
      acc[input.name] = value == null ? "" : String(value);
      return acc;
    }, {});
  }, []);

  const buildEmailPayload = useCallback(
    (values: TContactFormSchema) => ({
      routingConfigDocumentId: leadSelection?.routingConfigDocumentId,
      leadFormDocumentId: leadSelection?.leadFormDocumentId,
      pageSlug: pathname,
      leadData: buildLeadData(values)
    }),
    [leadSelection, pathname, buildLeadData]
  );

  const submitEmailFlow = useCallback(
    async (values: TContactFormSchema) => {
      try {
        const emailResponse = await dispatchLeadEmail(buildEmailPayload(values));
        const isSuccess = Boolean(emailResponse?.success);
        openStatusModal(isSuccess ? "success" : "error");
        return isSuccess;
      } catch (error) {
        console.error("error | dispatchLeadEmail", error);
        openStatusModal("error");
        return false;
      }
    },
    [buildEmailPayload, openStatusModal]
  );

  const submitTomFlow = useCallback(
    async (values: TContactFormSchema) => {
      const doc = String(
        values[FormContactInputType.DOCUMENT] ??
          values[FormContactInputType.CEDULA] ??
          ""
      );
      lastDocumentNumberRef.current = doc;
      try {
        const response = await mutateAsync(generateLead(values));
        return Boolean(response?.success);
      } catch {
        // Error modal is handled in mutation onError callback.
        return false;
      }
    },
    [mutateAsync, generateLead]
  );

  const submitBothFlow = useCallback(
    async (values: TContactFormSchema) => {
      const [tomResult, emailResult] = await Promise.allSettled([
        mutateAsync(generateLead(values)),
        dispatchLeadEmail(buildEmailPayload(values))
      ]);

      const tomResponse =
        tomResult.status === "fulfilled" ? tomResult.value : null;
      const isTomResolved = tomResult.status === "fulfilled" && Boolean(tomResponse);
      const isEmailSuccess =
        emailResult.status === "fulfilled" && emailResult.value?.success;

      if (!isTomResolved || !isEmailSuccess) {
        openStatusModal("error");
        return false;
      }

      // Preserve existing duplicated behavior from TOM onSuccess.
      // Only reset form when TOM reports real success.
      return Boolean(tomResponse?.success);
    },
    [mutateAsync, generateLead, buildEmailPayload, openStatusModal]
  );

  const getDistributionMode = useCallback((): TDistributionMode | null => {
    const sel = leadSelectionRef.current;
    const hasLeadFormContext = Boolean(
      sel?.leadFormDocumentId || sel?.routingConfigDocumentId
    );

    if (!hasLeadFormContext) return "tom";
    return sel?.distributionMode ?? null;
  }, []);

  const hasChannelConfigured = useCallback(
    (): boolean => Boolean(String(leadSelectionRef.current?.channel ?? "").trim()),
    []
  );

  const hasLeadFormContext = useCallback(
    (): boolean =>
      Boolean(
        leadSelectionRef.current?.leadFormDocumentId ||
          leadSelectionRef.current?.routingConfigDocumentId
      ),
    []
  );

  const formik = useFormik<TContactFormSchema>({
    initialValues,
    validate,
    validateOnMount: true,
    onSubmit: async (val) => {
      const distributionMode = getDistributionMode();
      if (!distributionMode) {
        console.error(
          "[contact-form] Configuracion incompleta: distributionMode no disponible para lead_form",
          {
            leadFormDocumentId: leadSelectionRef.current?.leadFormDocumentId,
            routingConfigDocumentId: leadSelectionRef.current?.routingConfigDocumentId
          }
        );
        openStatusModal("error");
        return;
      }

      if (
        hasLeadFormContext() &&
        (distributionMode === "tom" || distributionMode === "both") &&
        !hasChannelConfigured()
      ) {
        console.error(
          "[contact-form] Configuracion incompleta: channel no disponible para envio TOM",
          {
            leadFormDocumentId: leadSelectionRef.current?.leadFormDocumentId,
            routingConfigDocumentId: leadSelectionRef.current?.routingConfigDocumentId
          }
        );
        openStatusModal("error");
        return;
      }

      let isSuccess = false;

      if (distributionMode === "email") {
        isSuccess = await submitEmailFlow(val);
      } else if (distributionMode === "both") {
        isSuccess = await submitBothFlow(val);
      } else {
        isSuccess = await submitTomFlow(val);
      }

      if (isSuccess) {
        resetFormRef.current();
      }
    }
  });

  useEffect(() => {
    // Form schema can change at runtime (e.g. dynamic privacy field name per lead form).
    // Revalidate current values so isValid/errors are aligned without requiring user interaction.
    void formik.validateForm(formik.values);
  }, [data, leadSelection?.leadFormDocumentId]);

  resetFormRef.current = () => {
    const privacyFieldName = getPrivacyFieldName(dataRef.current);
    formik.resetForm({
      values: {
        [privacyFieldName]: false
      } as TContactFormSchema
    });
  };

  navigateAfterSuccessRef.current = () => {
    if (leadSelectionRef.current?.automaticFlow) {
      // LEGACY: old automatic-flow leads used a route change after success.
      // The new embedded checkout should provide setOnSuccessAction instead.
      router.push("/checkout");
      return true;
    }

    const href = String(dataRef.current?.button?.href ?? "").trim();
    if (!href) return false;

    if (dataRef.current?.button?.isExternalHref) {
      if (typeof window !== "undefined") {
        window.open(href, "_blank", "noopener,noreferrer");
      }
      return true;
    }

    router.push(href);
    return true;
  };

  return {
    data,
    leadSelection,
    handlerData,
    setLeadSelection,
    setOnSuccessAction,
    setSection,
    loading,
    statusType,
    setStatusType,
    setPlan,
    onSuccessAction: () => {
      successActionRef.current?.();
    },
    ...formik
  };
};
