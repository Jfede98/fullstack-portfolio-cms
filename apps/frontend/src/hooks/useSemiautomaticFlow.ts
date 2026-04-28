"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FormContactContext } from "@context/formContact";
import { ModalContext } from "@context/modal";
import { CityMapContext } from "@context/cityMap";
import { checkCoverageByCoords } from "@lib/api/leads/coverage";
import { updateAssistedLead, sendAssistedLead } from "@lib/api/leads/assisted";
import { RenderModalType, FormContactInputType } from "@lib/constants/state";
import { getUtmSource } from "@lib/utils/utms";
import { useCustomPathname } from "@hooks/useCustomPathname";
import { useGtm } from "@hooks/useGtm";
import type { IAddressCoordinates } from "@context/cityMap";
import type { TContactFormSchema } from "@lib/schemas/contactForm";
import type { IPlanCardData } from "@interfaces/components/planTab";
import type { TFlowStepType } from "@interfaces/lib/semiautomaticFlow";
import type { TAssistedLeadRequestPartial } from "@interfaces/lib/fetch/assistedLead";
import { useAppDispatch, useAppSelector } from "@store/semiautomaticFlow/hooks";
import {
  setSelectedPlan,
  setCoverageCompleted,
  clearLeadData,
  clearSelectedPlan,
  clearFlowState
} from "@store/semiautomaticFlow";

const FALLBACK_TOM_CHANNEL = "69a8638bd56833833dcad398";

type TStepInfo = { stepType?: TFlowStepType };

const getStringValue = (
  values: Record<string, unknown>,
  ...keys: string[]
): string => {
  for (const key of keys) {
    const value = values[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
};

export const useSemiautomaticFlow = (
  steps: TStepInfo[],
  isPlanMode: boolean = false,
  flowSource: "direct" | "cta" = "direct",
  hasResolvedEntryMode: boolean = true
) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = useCustomPathname();
  let searchFlowParam: string | null = null;
  if (typeof window !== "undefined") {
    try {
      searchFlowParam = new URL(window.location.href).searchParams.get("flow");
    } catch (err) {
      searchFlowParam = null;
    }
  }
  const inferredFlowSource: "direct" | "cta" =
    flowSource === "cta" ||
    (searchFlowParam && searchFlowParam.toLowerCase() === "cta")
      ? "cta"
      : "direct";
  const formContactCtx = useContext(FormContactContext);
  const {
    handlerState,
    handlerModalType,
    state: modalState
  } = useContext(ModalContext);
  const { selectedCity, selectedAddress } = useContext(CityMapContext);
  const { addEvent } = useGtm();
  const pendingSuccessRedirectRef = useRef(false);

  const getSelectedPlanItems = useCallback((plan?: IPlanCardData | null) => {
    if (!plan) return undefined;
    return [
      {
        item_id: plan.id ?? "",
        item_name: plan.name ?? "",
        item_category: plan.speedUnit ?? "",
        brand: "plan",
        price: plan.priceInfo?.amount?.replace("*", "") ?? "",
        quantity: 1
      }
    ];
  }, []);

  const totalSteps = steps.length;
  const coverageIdx = steps.findIndex((s) => s.stepType === "step.coverage");
  const finalIdx = steps.findIndex((s) => s.stepType === "step.final-data");
  const effectiveCoverageIndex = coverageIdx >= 0 ? coverageIdx : 0;
  const effectiveFinalIndex = finalIdx >= 0 ? finalIdx : totalSteps - 1;

  const [coverageLoading, setCoverageLoading] = useState(false);
  const [coverageApiError, setCoverageApiError] = useState(false);
  const [coverageApproved, setCoverageApproved] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const isMountedRef = useRef(false);

  const [activeStep, setActiveStep] = useState(
    isPlanMode ? effectiveCoverageIndex : 0
  );
  const currentStepType = steps[activeStep]?.stepType;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setActiveStep(isPlanMode ? effectiveCoverageIndex : 0);
  }, [isPlanMode, effectiveCoverageIndex]);

  const selectedAddressRef = useRef<IAddressCoordinates | null>(null);
  const selectedCityRef = useRef<string>("");
  const hasHydratedCoverageErrorFormRef = useRef(false);

  const leadId = useAppSelector((state) => state.semiautomaticFlow.leadId);
  const reduxPhone = useAppSelector((state) => state.semiautomaticFlow.phone);
  const reduxDocumentNumber = useAppSelector(
    (state) => state.semiautomaticFlow.documentNumber
  );
  const selectedPlan = useAppSelector(
    (state) => state.semiautomaticFlow.selectedPlan
  );

  const checkoutFlow = (() => {
    if (isPlanMode) return "plan";
    if (inferredFlowSource === "cta") return "cta_direct";
    if (leadId) return "form_direct";
    return "direct";
  })();

  const onAddressChange = useCallback((address: IAddressCoordinates | null) => {
    selectedAddressRef.current = address;
  }, []);

  const goToNextStep = useCallback(() => {
    setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const selectPlan = useCallback(
    (plan: IPlanCardData) => {
      dispatch(setSelectedPlan(plan));
      addEvent({
        event: "checkout_event",
        step: "plan_list",
        flow: checkoutFlow,
        section: "seleccionar plan",
        elementDescription: plan.name ?? "",
        item: getSelectedPlanItems(plan)
      });
    },
    [dispatch, addEvent, checkoutFlow, getSelectedPlanItems]
  );

  useEffect(() => {
    if (!hasResolvedEntryMode) return;
    addEvent({
      event: "checkout_event",
      step: "begin_checkout",
      flow: checkoutFlow,
      section: "inicio checkout",
      elementDescription: "inicio checkout",
      item: getSelectedPlanItems(selectedPlan)
    });
  }, [checkoutFlow, addEvent, getSelectedPlanItems, selectedPlan, hasResolvedEntryMode]);

  const prevCityRef = useRef<string | null>(null);
  useEffect(() => {
    if (!selectedCity || selectedCity === prevCityRef.current) return;
    prevCityRef.current = selectedCity;
    addEvent({
      event: "checkout_event",
      step: "coverage_map",
      flow: checkoutFlow,
      section: "input ciudad",
      elementDescription: selectedCity,
      item: getSelectedPlanItems(selectedPlan)
    });
  }, [selectedCity]);

  const prevAddressRef = useRef<string | null>(null);
  useEffect(() => {
    if (
      !selectedAddress?.label ||
      selectedAddress.label === prevAddressRef.current
    )
      return;
    prevAddressRef.current = selectedAddress.label;
    addEvent({
      event: "checkout_event",
      step: "coverage_map",
      flow: checkoutFlow,
      section: "input direccion",
      elementDescription: selectedAddress.label,
      item: getSelectedPlanItems(selectedPlan)
    });
  }, [selectedAddress]);

  const finalStepIndex = effectiveFinalIndex;
  useEffect(() => {
    if (activeStep !== finalStepIndex || !leadId) return;
    if (reduxPhone) formContactCtx.setFieldValue?.("phone", reduxPhone);
    if (reduxDocumentNumber)
      formContactCtx.setFieldValue?.("document", reduxDocumentNumber);
  }, [activeStep, finalStepIndex, leadId]);

  useEffect(() => {
    if (!coverageApproved) return;
    addEvent({
      event: "checkout_event",
      step: "plan_list",
      flow: checkoutFlow,
      section: "cobertura exitosa",
      elementDescription: "cobertura exitosa",
      item: getSelectedPlanItems(selectedPlan)
    });
  }, [coverageApproved]);

  const hasTrackedFinalStepRef = useRef(false);
  useEffect(() => {
    if (activeStep !== effectiveFinalIndex) {
      hasTrackedFinalStepRef.current = false;
      return;
    }
    if (hasTrackedFinalStepRef.current || !coverageApproved) return;
    hasTrackedFinalStepRef.current = true;
    addEvent({
      event: "checkout_event",
      step: "form_checkout",
      flow: checkoutFlow,
      section: "iniciar data_form cobertura",
      elementDescription: "iniciar data_form de usuario con cobertura",
      item: getSelectedPlanItems(selectedPlan)
    });
  }, [activeStep, coverageApproved]);

  const hasTrackedCoverageErrorFormRef = useRef(false);
  useEffect(() => {
    if (!coverageApiError || hasTrackedCoverageErrorFormRef.current) return;
    hasTrackedCoverageErrorFormRef.current = true;
    addEvent({
      event: "checkout_event",
      step: "form_checkout",
      flow: checkoutFlow,
      section: "iniciar data_form sin cobertura",
      elementDescription: "iniciar data_form de usuario sin cobertura",
      item: getSelectedPlanItems(selectedPlan)
    });
  }, [coverageApiError]);

  useEffect(() => {
    if (!coverageApiError || !leadId) {
      hasHydratedCoverageErrorFormRef.current = false;
      return;
    }
    if (hasHydratedCoverageErrorFormRef.current) return;

    if (reduxPhone) {
      formContactCtx.setFieldValue?.(FormContactInputType.PHONE, reduxPhone);
    }

    if (reduxDocumentNumber) {
      formContactCtx.setFieldValue?.(
        FormContactInputType.DOCUMENT,
        reduxDocumentNumber
      );
      formContactCtx.setFieldValue?.(
        FormContactInputType.CEDULA,
        reduxDocumentNumber
      );
    }

    hasHydratedCoverageErrorFormRef.current = true;
  }, [
    coverageApiError,
    leadId,
    reduxPhone,
    reduxDocumentNumber,
    formContactCtx
  ]);

  useEffect(() => {
    if (!pendingSuccessRedirectRef.current) return;
    if (!modalState) {
      pendingSuccessRedirectRef.current = false;
      router.push("/");
    }
  }, [modalState, router]);

  const handleCoverageCheck = useCallback(
    async (values: TContactFormSchema) => {
      selectedCityRef.current = String(
        (values as Record<string, unknown>).city ?? ""
      );

      const address = selectedAddressRef.current;

      if (!address) {
        console.warn(
          "[SemiautomaticFlow] No hay dirección seleccionada en el mapa."
        );
        return;
      }

      if (isMountedRef.current) setCoverageLoading(true);
      try {
        const result = await checkCoverageByCoords(
          address.latitude,
          address.longitude,
          address.label
        );

        if (result.hasCoverage) {
          if (isMountedRef.current) {
            setCoverageApiError(false);
            setCoverageApproved(true);
          }
          dispatch(setCoverageCompleted(true));
          addEvent({
            event: "checkout_event",
            step: "coverage_map",
            flow: checkoutFlow,
            section: "cta siguiente paso",
            elementDescription: "ir a siguiente paso",
            item: getSelectedPlanItems(selectedPlan)
          });
          if (isMountedRef.current) {
            setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1));
          }
        } else {
          if (isMountedRef.current) setCoverageApiError(true);
          dispatch(setCoverageCompleted(false));
        }
      } catch (error) {
        if (isMountedRef.current) setCoverageApiError(true);
        dispatch(setCoverageCompleted(false));
        console.error(
          "[SemiautomaticFlow] Error al verificar cobertura:",
          error
        );
      } finally {
        if (isMountedRef.current) setCoverageLoading(false);
      }
    },
    [totalSteps]
  );

  const handleFinalStepUpdate = useCallback(
    async (values: TContactFormSchema) => {
      if (!leadId) {
        console.warn(
          "[SemiautomaticFlow] handleFinalStepUpdate → sin leadId, saliendo"
        );
        return;
      }

      const address = selectedAddressRef.current;

      const updatePayload = {
        id: leadId,
        location: {
          has_location: true,
          city: selectedCityRef.current,
          lat:
            address?.latitude != null
              ? parseFloat(String(address.latitude))
              : undefined,
          lng:
            address?.longitude != null
              ? parseFloat(String(address.longitude))
              : undefined,
          raw_address: address?.label ?? "",
          reference: ""
        },
        products: selectedPlan
          ? [
              {
                product_name: selectedPlan.name ?? "",
                product_price: Number(
                  selectedPlan.priceInfo?.amount
                    ?.replace("*", "")
                    .replace("$", "") ?? ""
                ),
                product_code: selectedPlan.id ?? ""
              }
            ]
          : []
      };

      if (isMountedRef.current) setUpdateLoading(true);
      try {
        addEvent({
          event: "checkout_event",
          step: "form_checkout",
          flow: checkoutFlow,
          section: "finalizar checkout cobertura",
          elementDescription: "finalizar checkout con cobertura",
          item: getSelectedPlanItems(selectedPlan)
        });
        const response = await updateAssistedLead(updatePayload);
        const nextStatus = response?.success ? "success" : "error";
        if (response?.success) {
          addEvent({
            event: "checkout_event",
            step: "updated_lead",
            flow: checkoutFlow,
            section: "lead actualizado cobertura",
            elementDescription: "lead actualizado cobertura",
            idTransaction: leadId,
            item: getSelectedPlanItems(selectedPlan)
          });
          formContactCtx.resetForm?.();
          dispatch(clearLeadData());
          dispatch(clearSelectedPlan());
          dispatch(setCoverageCompleted(false));
          clearFlowState();
          pendingSuccessRedirectRef.current = true;
        }
        if (isMountedRef.current) {
          formContactCtx.setStatusType?.(nextStatus);
        }
        handlerModalType?.(RenderModalType.CONTACT_FORM_STATUS);
        handlerState(true);
      } catch (error) {
        console.error("[SemiautomaticFlow] Error actualizando lead:", error);
        if (isMountedRef.current) {
          formContactCtx.setStatusType?.("error");
        }
        handlerModalType?.(RenderModalType.CONTACT_FORM_STATUS);
        handlerState(true);
      } finally {
        if (isMountedRef.current) setUpdateLoading(false);
      }
    },
    [
      leadId,
      selectedPlan,
      formContactCtx,
      handlerState,
      handlerModalType,
      dispatch
    ]
  );

  const handleDirectLeadCreate = useCallback(
    async (values: TContactFormSchema) => {
      const address = selectedAddressRef.current;
      const utmSource = getUtmSource();
      const v = values as Record<string, unknown>;
      const fullName =
        getStringValue(v, "full_name", "name") || `formulario_${pathname}`;

      const docNumber = String(
        v[FormContactInputType.DOCUMENT] ??
          v[FormContactInputType.CEDULA] ??
          v[FormContactInputType.RUC] ??
          ""
      );
      const isRuc = docNumber.length === 13;
      const channel =
        String(formContactCtx.leadSelection?.channel ?? "").trim() ||
        FALLBACK_TOM_CHANNEL;

      const leadPayload: TAssistedLeadRequestPartial = {
        channel,
        event_datetime: new Date().toISOString(),
        source: utmSource,
        terms_and_conditions: true,
        customer: {
          full_name: fullName,
          document_type: !isRuc
            ? FormContactInputType.CEDULA
            : FormContactInputType.RUC,
          document_number: docNumber,
          phone: String(v[FormContactInputType.PHONE] ?? ""),
          email: String(v[FormContactInputType.EMAIL] ?? "") || undefined
        },
        location: {
          has_location: Boolean(address),
          city: selectedCityRef.current,
          lat:
            address?.latitude != null
              ? parseFloat(String(address.latitude))
              : undefined,
          lng:
            address?.longitude != null
              ? parseFloat(String(address.longitude))
              : undefined,
          raw_address: address?.label ?? "",
          reference: ""
        },
        products: selectedPlan
          ? [
              {
                product_name: selectedPlan.name ?? "",
                product_price: Number(
                  selectedPlan.priceInfo?.amount
                    ?.replace("*", "")
                    .replace("$", "") ?? ""
                ),
                product_code: selectedPlan.id ?? ""
              }
            ]
          : []
      };

      if (isMountedRef.current) setUpdateLoading(true);
      try {
        addEvent({
          event: "checkout_event",
          step: "form_checkout",
          flow: checkoutFlow,
          section: "finalizar checkout sin cobertura",
          elementDescription: "finalizar checkout sin cobertura",
          item: getSelectedPlanItems(selectedPlan)
        });
        const response = await sendAssistedLead(leadPayload);
        const nextStatus = response?.success
          ? "success"
          : response?.isDuplicate
            ? "duplicated"
            : "error";
        if (response?.success) {
          addEvent({
            event: "checkout_event",
            step: "created_lead",
            flow: checkoutFlow,
            section: "lead creado sin cobertura",
            elementDescription: "lead creado sin cobertura",
            idTransaction: response.id ?? "",
            item: getSelectedPlanItems(selectedPlan)
          });
          formContactCtx.resetForm?.();
          dispatch(clearSelectedPlan());
          dispatch(setCoverageCompleted(false));
          clearFlowState();
          pendingSuccessRedirectRef.current = true;
        }
        if (isMountedRef.current) {
          formContactCtx.setStatusType?.(nextStatus);
        }
        handlerModalType?.(RenderModalType.CONTACT_FORM_STATUS);
        handlerState(true);
      } catch (error) {
        console.error("[SemiautomaticFlow] Error creando lead directo:", error);
        if (isMountedRef.current) {
          formContactCtx.setStatusType?.("error");
        }
        handlerModalType?.(RenderModalType.CONTACT_FORM_STATUS);
        handlerState(true);
      } finally {
        if (isMountedRef.current) setUpdateLoading(false);
      }
    },
    [formContactCtx, selectedPlan, handlerState, handlerModalType, dispatch]
  );

  const finalStepHandleSubmit = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      formContactCtx
        .validateForm?.(formContactCtx.values)
        .then(async (formErrors) => {
          if (Object.keys(formErrors ?? {}).length > 0) {
            const touched = Object.keys(formErrors ?? {}).reduce(
              (acc, key) => ({ ...acc, [key]: true }),
              {}
            );
            formContactCtx.setTouched?.(touched);
            return;
          }
          await handleFinalStepUpdate(
            (formContactCtx.values ?? {}) as TContactFormSchema
          );
        });
    },
    [formContactCtx, handleFinalStepUpdate]
  );

  const directLeadFinalStepSubmit = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      formContactCtx
        .validateForm?.(formContactCtx.values)
        .then(async (formErrors) => {
          if (Object.keys(formErrors ?? {}).length > 0) {
            const touched = Object.keys(formErrors ?? {}).reduce(
              (acc, key) => ({ ...acc, [key]: true }),
              {}
            );
            formContactCtx.setTouched?.(touched);
            return;
          }
          await handleDirectLeadCreate(
            (formContactCtx.values ?? {}) as TContactFormSchema
          );
        });
    },
    [formContactCtx, handleDirectLeadCreate]
  );

  const isFinalStep = activeStep === finalStepIndex;
  const isCoverageErrorFlow = coverageApiError;

  const lockedFields =
    leadId && (isFinalStep || isCoverageErrorFlow)
      ? [
          FormContactInputType.PHONE,
          FormContactInputType.DOCUMENT,
          FormContactInputType.CEDULA
        ]
      : [];

  const enrichedCtx = {
    ...formContactCtx,
    loading:
      coverageLoading || updateLoading || (formContactCtx.loading ?? false),
    onSimpleAction: isCoverageErrorFlow
      ? leadId
        ? handleFinalStepUpdate
        : handleDirectLeadCreate
      : currentStepType === "step.data"
        ? goToNextStep
      : activeStep === effectiveCoverageIndex
        ? handleCoverageCheck
        : leadId
          ? handleFinalStepUpdate
          : handleDirectLeadCreate,
    handleSubmit: isCoverageErrorFlow
      ? leadId
        ? finalStepHandleSubmit
        : directLeadFinalStepSubmit
      : isFinalStep
        ? leadId
          ? finalStepHandleSubmit
          : directLeadFinalStepSubmit
        : formContactCtx.handleSubmit,
    lockedFields,
    onSuccessAction: () => router.push("/")
  };

  return {
    activeStep,
    setActiveStep,
    onAddressChange,
    goToNextStep,
    selectPlan,
    coverageApiError,
    coverageApproved,
    enrichedCtx
  };
};
