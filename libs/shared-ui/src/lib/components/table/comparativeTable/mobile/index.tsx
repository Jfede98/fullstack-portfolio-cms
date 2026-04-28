import type { IComparativeTableProps } from "@shared-ui/interfaces/table/comparativeTable";
import type { FC } from "react";
import { Tab } from "@shared-ui/components/tab";
import { ComparativeTableSection } from "../section";

export const ComparativeTableMobile: FC<IComparativeTableProps> = ({
  sections,
  comparative
}) => (
    <Tab
      rounded
      className={{
        trigger:
          "justify-start p-0! gap-2 px-4 snap-x",
        triggerElementWrapper:
          "flex-none! min-w-fit! px-4! snap-center",
        triggerLabel: "leading-5"
      }}
      tabs={
        sections?.map((p, idx) => ({
          id: idx.toString(),
          content: <ComparativeTableSection {...p} comparative={comparative} />,
          label: p.label
        })) ?? []
      }
    />
);
