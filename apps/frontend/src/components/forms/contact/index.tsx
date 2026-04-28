"use client";

import type { ICoverageFormProps } from "@interfaces/coverageForm";
import type { ILeadFormSelection } from "@interfaces/coverageForm";
import { CoverageFormStyle } from "./style";
import { Button, CheckboxCustom, Icon, Typography } from "@sitio-publico/shared-ui";
import { FC, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@store/semiautomaticFlow";
import { ClientPlanCard } from "@components/client/ClientPlanCard";
import { FormContactContext } from "@context/formContact";
import { Field } from "./field";
import type { TContactFormSchema } from "@lib/schemas/contactForm";
import { HeroConfigContext } from "@context/heroConfig";
import { FormContactInputType } from "@lib/constants/state";
import { ChangePlanModal } from "@components/flows/automatic/ChangePlanModal";

type ContactFormProps = Partial<ICoverageFormProps> & {
  leadSelection?: ILeadFormSelection;
};

const IDENTIFIER_SIMPLE = 2;
const IDENTIFIER_COVERAGE = 5;

export const ContactForm: FC<ContactFormProps> = ({
  isBlock = false,
  section,
  variant,
  leadSelection,
  ...props
}) => {
  const { horizontalFormOnDesktop } = useContext(HeroConfigContext);
  const {
    data,
    handleSubmit,
    getFieldProps,
    setFieldValue,
    loading,
    errors,
    values,
    touched,
    submitCount,
    handlerData,
    setLeadSelection: setLeadSelectionContext,
    onSimpleAction,
    isValid,
  } =
    useContext(FormContactContext);

  const baseFormSource = isBlock ? props : (data ?? props);
  const basePrivacyName =
    baseFormSource.privacyCheckbox?.name ?? "privacy_policy";
  const scopedPrivacyName =
    leadSelection?.leadFormDocumentId && isBlock
      ? `${basePrivacyName}__${leadSelection.leadFormDocumentId}`
      : basePrivacyName;
  const formSource =
    baseFormSource.privacyCheckbox && scopedPrivacyName !== basePrivacyName
      ? {
          ...baseFormSource,
          privacyCheckbox: {
            ...baseFormSource.privacyCheckbox,
            name: scopedPrivacyName,
          },
        }
      : baseFormSource;

  const {
    title: titleProp,
    description,
    icon,
    inputs,
    button,
    privacyCheckbox,
    showBorderLine,
    mobileAfterInputsContent,
    showSelectedPlanInline
  } = formSource;

  const hasColumnLayout = Boolean(
    inputs?.some((input) => input.column && input.column !== "default")
  );
  const resolvedVariant = variant ?? data?.variant;
  const shouldPreserveSemiautomaticVariant =
    resolvedVariant === "semiautomatic-data" ||
    resolvedVariant === "semiautomatic-flow" ||
    resolvedVariant === "semiautomatic-error";
  const formVariant =
    resolvedVariant === "dsa"
      ? "dsa"
      : shouldPreserveSemiautomaticVariant
        ? resolvedVariant
      : horizontalFormOnDesktop
        ? "horizontal"
        : (resolvedVariant ?? "default");
  const isDsaVariant = formVariant === "dsa";
  const isSemiautomaticDataVariant = formVariant === "semiautomatic-data";
  const isSemiautomaticFlowVariant = formVariant === "semiautomatic-flow";
  const isCheckoutFlowVariant =
    isSemiautomaticDataVariant || isSemiautomaticFlowVariant;
  const shouldRenderTopIcon = Boolean(icon) && !shouldPreserveSemiautomaticVariant;

  const { base, top, title, subTitle, formContent, inputsContainer, checkboxContainer, buttonContainer } = CoverageFormStyle({
    isBlock: isDsaVariant ? false : isBlock,
    variant: formVariant,
    showBorderLine: showBorderLine ?? true
  });
  const privacyFieldName = privacyCheckbox?.name ?? "privacy_policy";
  const privacyFieldKey = privacyFieldName as keyof TContactFormSchema;
  const privacyFieldProps = getFieldProps?.(privacyFieldName);
  const privacyError =
    (touched?.[privacyFieldKey] || (submitCount ?? 0) > 0) && errors?.[privacyFieldKey]
      ? String(errors?.[privacyFieldKey])
      : undefined;

  const buttonIdentifier = button?.identifier ?? 0;
  const isSemiautomaticError =
    resolvedVariant === "semiautomatic-error";
  const isCoverageAction =
    buttonIdentifier === IDENTIFIER_COVERAGE ||
    (buttonIdentifier === IDENTIFIER_SIMPLE && !isSemiautomaticError);
  const hasTitle = Boolean(titleProp?.trim());
  const hasDescription = Boolean(description?.trim());
  const hasTopContent = Boolean(shouldRenderTopIcon || hasTitle || hasDescription);
  const selectedPlan = useSelector(
    (state: RootState) => state.semiautomaticFlow.selectedPlan
  );
  const [hasMounted, setHasMounted] = useState(false);
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false);
  const shouldShowSelectedPlanInline = Boolean(
    hasMounted && showSelectedPlanInline && selectedPlan
  );
  const selectedPlanTitle = formSource.selectedPlanTitle?.trim() || "Tu plan:";
  const selectedPlanActionLabel =
    formSource.selectedPlanActionLabel?.trim() || "Cambiar plan";

  const areRequiredFieldsCompleted = Boolean(
    inputs?.every((input) => {
      if (!input.required || !input.name) return true;
      const fieldName =
        input.name === FormContactInputType.CEDULA ||
        input.name === FormContactInputType.RUC
          ? FormContactInputType.DOCUMENT
          : input.name;
      const value = values?.[fieldName as keyof TContactFormSchema];
      return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
    }) &&
      (!privacyCheckbox?.required || Boolean(values?.[privacyFieldKey]))
  );

  const isActionDisabled = isCheckoutFlowVariant
    ? Boolean(loading) || !areRequiredFieldsCompleted || isValid === false
    : Boolean(loading) || isValid === false;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleSimpleClick = () => {
    if (onSimpleAction && values) {
      onSimpleAction(values as TContactFormSchema);
    }
  };

  const syncContextWithCurrentForm = () => {
    if (!isBlock) return;
    if (formSource) handlerData?.(formSource as ICoverageFormProps);
    setLeadSelectionContext?.(leadSelection);
  };

  return (
    <section className={base()}>
      {hasTopContent && (
        <div className={top()}>
          {shouldRenderTopIcon && icon?.name && (
            <Icon {...icon} name={icon.name} size={icon.size ?? "lg"} />
          )}
          <div>
            {hasTitle && (
              <Typography tag="h3" unstyled className={{ base: title() }}>
                {titleProp}
              </Typography>
            )}
            {hasDescription && (
              <Typography tag="p" unstyled className={{ base: subTitle() }}>
                {description}
              </Typography>
            )}
          </div>
        </div>
      )}

      <form
        onFocusCapture={(event) => {
          const target = event.target as HTMLElement | null;
          if (target?.closest("a")) return;
          syncContextWithCurrentForm();
        }}
        onSubmit={(event) => {
          syncContextWithCurrentForm();
          if (!handleSubmit) return;
          void handleSubmit(event);
        }}
        noValidate
        className={formContent()}
      >
        {shouldShowSelectedPlanInline && selectedPlan && isSemiautomaticDataVariant && (
          <div className="w-full">
            <div className="mb-4 flex items-center justify-between gap-4">
              <Typography
                tag="p"
                unstyled
                className={{ base: "text-[16px] leading-6 font-bold text-[#44224C]" }}
              >
                {selectedPlanTitle}
              </Typography>
              <button
                type="button"
                className="text-[14px] leading-6 font-medium text-[#83378F]"
                onClick={() => setIsChangePlanModalOpen(true)}
              >
                {selectedPlanActionLabel}
              </button>
            </div>
            <ClientPlanCard
              {...selectedPlan}
              ctaButtons={[]}
              desktopPresentation="mobile"
              mobilePresentation="accordion"
              className={{
                wrapper: "!max-w-full",
                mobileAccordionCard: "!w-full"
              }}
            />
          </div>
        )}

        <div className={inputsContainer()}>
          {inputs?.map((input, idx) => {
            const getFieldClasses = () => {
              if (!hasColumnLayout) {
                return isDsaVariant ? "w-full" : "flex-1 min-w-50 mb-2 last:mb-0";
              }
              if (formVariant !== "columnLayout" as any) return "flex-1 min-w-50 mb-2 last:mb-0";

              switch (input.column) {
                case "left":
                case "right":
                  return "flex-1 min-w-50 mb-2 last:mb-0";
                case "full":
                  return "flex-1 min-w-50 mb-2 last:mb-0 lg:col-span-2";
                case "default":
                default:
                  return "flex-1 min-w-50 mb-2 last:mb-0 lg:col-span-2";
              }
            };

            return (
              <div key={idx} className={getFieldClasses()}>
                <Field
                  {...input}
                  variant={formVariant}
                  getFieldProps={getFieldProps!}
                  setFieldValue={setFieldValue!}
                  loading={loading ?? false}
                  errors={errors!}
                  touched={touched ?? {}}
                  submitCount={submitCount ?? 0}
                />
              </div>
            );
          })}
        </div>

        {shouldShowSelectedPlanInline && selectedPlan && !isSemiautomaticDataVariant && (
          <div className="w-full md:hidden">
            <Typography
              tag="p"
              unstyled
              className={{ base: "mb-2 text-[18px] leading-6 font-bold text-[#83378F]" }}
            >
              Tu plan:
            </Typography>
            <ClientPlanCard
              {...selectedPlan}
              ctaButtons={[]}
              mobilePresentation="accordion"
            />
          </div>
        )}

        {privacyCheckbox && (
          <div className={checkboxContainer()}>
            <CheckboxCustom
              label={privacyCheckbox.label}
              name={privacyFieldName}
              required={privacyCheckbox.required}
              checked={Boolean(values?.[privacyFieldKey])}
              onChange={(event) =>
                setFieldValue?.(privacyFieldName, event.target.checked)
              }
              onBlur={privacyFieldProps?.onBlur}
              disabled={loading}
              errorMessage={privacyError}
            />
          </div>
        )}

        {mobileAfterInputsContent ? (
          <div className="mt-3 w-full md:hidden">{mobileAfterInputsContent}</div>
        ) : null}

        <div
          className={buttonContainer()}
        >
          <Button
            type={isCoverageAction ? "button" : "submit"}
            color={button?.color}
            loading={loading}
            disabled={isActionDisabled}
            {...(isCoverageAction && { onClick: handleSimpleClick })}
            className={{
              base: isDsaVariant
                ? "w-full h-12 rounded-[4px] bg-[#FFCF00] text-[#44224C] text-sm font-medium leading-6 lg:h-14 lg:w-[281px]"
                : isCheckoutFlowVariant
                  ? "!h-12 !w-full !rounded-[4px]"
                  : "w-full lg:h-full lg:w-full"
            }}
          >
            {button?.children}
          </Button>
        </div>
      </form>

      {isSemiautomaticDataVariant && (
        <ChangePlanModal
          isOpen={isChangePlanModalOpen}
          onClose={() => setIsChangePlanModalOpen(false)}
          planTabData={formSource.changePlanTabData}
        />
      )}
    </section>
  );
};
