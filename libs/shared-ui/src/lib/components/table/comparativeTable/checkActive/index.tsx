import { Icon } from "@shared-ui/components/icons";
import { ComparativeTableCheckStyle } from "./style";
import type { FC } from "react";

export const ComparativeTableCheck: FC<{ active?: boolean }> = ({ active }) => {
  const { iconColumn } = ComparativeTableCheckStyle({ active });
  return (
    <Icon
      name="check_circle"
      type="rounded"
      size="msm"
      className={{
        base: iconColumn()
      }}
    />
  );
};
