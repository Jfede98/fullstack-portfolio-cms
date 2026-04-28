import type { ComparativeTableSlide } from "@shared-ui/interfaces/table/comparativeTable";
import { type FC } from "react";
import { ComparativeTableSectionStyles } from "./style";
import clsx from "clsx";
import { PlanComparativeTable } from "../plan";
import { Description } from "../description";
import { ComparativeTableCheck } from "../checkActive";

export const ComparativeTableSection: FC<ComparativeTableSlide> = ({
  active,
  plan,
  label,
  comparative
}) => {
  const { base, row } = ComparativeTableSectionStyles();

  return (
    <div className={clsx(base())}>
      {comparative &&
        comparative?.map(({ label, description }, idx) => (
          <article key={idx} className={clsx(row())}>
            <Description label={label} description={description} />
            <ComparativeTableCheck active={active?.[idx] ?? false} />
          </article>
        ))}
      {plan && <PlanComparativeTable {...plan} label={label} />}
    </div>
  );
};
