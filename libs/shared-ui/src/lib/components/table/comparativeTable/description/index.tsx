import { Tooltip } from "@shared-ui/components/tooltip";
import { CompartiveTableDescriptionStlye } from "./style";
import { Icon } from "@shared-ui/components/icons";
import type { FC } from "react";
import type { ComparativeTableColumn } from "@shared-ui/interfaces/table/comparativeTable";

export const Description: FC<ComparativeTableColumn> = ({
  label,
  description
}) => {
  const { base, rowLabel, iconTooltip } = CompartiveTableDescriptionStlye();
  return (
    <div className={base()}>
      <span className={rowLabel()}>{label}</span>
      <Tooltip content={description ?? ""}>
        <Icon name="info" className={{ base: iconTooltip() }} size="msm" />
      </Tooltip>
    </div>
  );
};
