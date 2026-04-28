import type { IComparativeTableProps } from "@shared-ui/interfaces/table/comparativeTable";
import type { FC } from "react";
import { Typography } from "@shared-ui/components/typography";
import { ComparativeTableDeskStyles } from "./style";
import { Description } from "../description";
import { PlanComparativeTable } from "../plan";
import { ComparativeTableCheck } from "../checkActive";
import clsx from "clsx";

export const ComparativeTableDesk: FC<
  IComparativeTableProps & { desktop?: boolean}
> = ({ comparative, sections, desktop, titleTable = { tag: "span", variant: "h2", type: "regular", children: "Plan" } }) => {
  const { base, thStyle, tdStyle, thHeadTitle } = ComparativeTableDeskStyles();

  return (
    <table className={base()}>
      <thead>
        <tr>
          <th className={thStyle()}>
            <Typography
              tag="span"
              variant="h2"
              type="regular"
              {...titleTable}
              className={{
                ...titleTable?.className,
                base: clsx(titleTable?.className?.base, thHeadTitle())
              }}
            />
          </th>
          {sections?.map(({ plan, label }, idx) => (
            <th key={idx} className={thStyle()}>
              {plan && (
                <PlanComparativeTable
                  {...plan}
                  label={label}
                  desktop={desktop}
                />
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {comparative?.map(({ label, description }, jdx) => (
          <tr key={jdx}>
            <td className={clsx(tdStyle(), "px-3")}>
              <Description label={label} description={description} />
            </td>
            {sections?.map(({ active }, kdx) => (
              <td key={`${kdx}-${jdx}`} className={tdStyle()}>
                <ComparativeTableCheck active={active?.[jdx] ?? false} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
