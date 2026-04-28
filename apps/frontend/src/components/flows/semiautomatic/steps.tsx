import {
  cloneElement,
  isValidElement,
  type FC,
  type ReactElement,
  type ReactNode
} from "react";
import type {
  TStrapiCoverageError,
  TStrapiStepCoverage,
  TStrapiStepFinalData,
  TStrapiStepPlans
} from "@interfaces/lib/semiautomaticFlow.ts";
import { mapPlanTab } from "@lib/helpers/mappers/planTab";
import { StepPlansDisplay } from "./StepPlansDisplay";
import { StepCoverageErrorClient } from "./StepCoverageErrorClient";
import { StepFinalDataPlanCard } from "./StepFinalDataPlanCard";

type TStepCoverageProps = TStrapiStepCoverage & {
  layoutPreset?: "default" | "automatic";
};

export const StepCoverage: FC<TStepCoverageProps> = async ({
  content,
  layoutPreset = "default"
}) => {
  if (!content) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-400">No hay contenido de cobertura configurado.</p>
      </div>
    );
  }

  const hasContent =
    content.leftContentType ?? content.rightContentType ?? content.leftWidget ?? content.rightWidget;
  if (!hasContent) return null;

  const { TwoColumnsBlock } = await import("@components/twoColumns");
  const { mapTwoColumns } = await import("@lib/helpers/mappers/twoColumns");

  const props = mapTwoColumns({
    leftContentType: content.leftContentType,
    rightContentType: content.rightContentType,
    leftWidget: content.leftWidget,
    rightWidget: content.rightWidget,
    backgroundVariant: content.backgroundVariant,
    showDivider: content.showDivider,
    dividerColor: content.dividerColor,
  }, { formVariant: "semiautomatic-flow" });

  const automaticClassName = layoutPreset === "automatic"
      ? {
        base: "py-0 lg:py-0",
        container: "max-w-[360px] items-start gap-4 lg:max-w-[1120px] lg:gap-[71px]",
        left:
          "max-w-[360px] lg:basis-[543px] lg:max-w-[543px] lg:shrink-0 [&>section]:w-full [&>section]:max-w-[360px] lg:[&>section]:max-w-[543px]",
        right: "hidden md:flex md:max-w-[360px] lg:basis-[506px] lg:max-w-[506px] lg:shrink-0 lg:justify-start"
      }
    : undefined;

  const leftContent = layoutPreset === "automatic" &&
    props.rightContent &&
    isValidElement(props.leftContent)
    ? cloneElement(
        props.leftContent as ReactElement<{ mobileAfterInputsContent?: ReactNode }>,
        { mobileAfterInputsContent: props.rightContent }
      )
    : props.leftContent;

  return (
    <TwoColumnsBlock
      {...props}
      leftWidth={undefined}
      rightWidth={undefined}
      leftContent={leftContent}
      rightContent={props.rightContent}
      className={automaticClassName}
    />
  );
};

export const StepFinalData: FC<TStrapiStepFinalData> = async ({ content }) => {
  if (!content) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-400">No hay contenido de datos finales configurado.</p>
      </div>
    );
  }

  const hasContent =
    content.leftContentType ?? content.rightContentType ?? content.leftWidget ?? content.rightWidget;
  if (!hasContent) return null;

  const { TwoColumnsBlock } = await import("@components/twoColumns");
  const { mapTwoColumns } = await import("@lib/helpers/mappers/twoColumns");

  const props = mapTwoColumns({
    leftContentType: content.leftContentType,
    rightContentType: content.rightContentType,
    leftWidget: content.leftWidget,
    rightWidget: content.rightWidget,
    backgroundVariant: content.backgroundVariant,
    showDivider: content.showDivider,
    dividerColor: content.dividerColor
  }, { formVariant: "semiautomatic-flow", forceShowBorderLine: false, showSelectedPlanInline: true });

  return (
    <TwoColumnsBlock
      {...props}
      leftWidth={undefined}
      rightWidth={undefined}
      className={{
        container: "lg:max-w-[1110px] lg:justify-start lg:gap-[92px]",
        left: "lg:basis-[543px] lg:max-w-[543px] lg:shrink-0",
        right: "hidden md:block lg:basis-[382px] lg:max-w-[382px] lg:shrink-0",
        divider: "hidden lg:block"
      }}
      rightContent={<StepFinalDataPlanCard />}
    />
  );
};

export const StepPlans: FC<TStrapiStepPlans> = async ({ title, subtitle, plan_tab }) => {

  const planTabData = plan_tab
    ? mapPlanTab({ ...plan_tab, mobilePresentation: plan_tab.mobilePresentation ?? "accordion" })
    : null;
  const hasPlans = planTabData?.categories?.some(
    (c) => c.plans && c.plans.length > 0
  );

  return (
    <div className="mx-auto flex w-full max-w-[313px] flex-col py-4 md:max-w-none md:py-6">
      {(title || subtitle) && (
        <div className="flex w-full flex-col items-start gap-2 text-left md:items-start md:text-left">
          {title && (
            <h2 className="w-full text-[22px] leading-7 font-bold text-[#83378F] md:max-w-[772px] md:text-[40px] md:leading-[48px]">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="w-full text-[18px] leading-6 font-normal text-[#2C2C30] md:text-[22px] md:leading-[28px]">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {hasPlans && planTabData ? (
        <StepPlansDisplay planTabData={planTabData} />
      ) : (
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-400">No hay planes configurados en este paso.</p>
        </div>
      )}
    </div>
  );
};

export const StepCoverageError: FC<TStrapiCoverageError> = ({
  errorMessage,
  title,
  subtitle,
  lead_form
}) => {
  return (
    <StepCoverageErrorClient
      errorMessage={errorMessage}
      title={title}
      subtitle={subtitle}
      leadForm={lead_form}
    />
  );
};
