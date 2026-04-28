import type { IComparativeTableProps } from "@shared-ui/interfaces/table/comparativeTable";
import type { FC } from "react";
import { ComparativeTableMobile } from "./mobile";
import { Typography } from "@shared-ui/components/typography";
import { ComparativeTableStyle } from "./style";
import clsx from "clsx";
import { ComparativeTableDesk } from "./table";
import { useMatchMedia } from "@shared-ui/hooks/useMatchMedia";

export const ComparativeTable: FC<IComparativeTableProps> = ({
  title,
  subtitle,
  matchMediaBreakpoint,
  titleTable,
  ...props
}) => {
  const { subtitleStyle, titleStyle, header } = ComparativeTableStyle();
  const { isDesktop } = useMatchMedia(matchMediaBreakpoint);

  return (
    <div className={"px-4"}>
      <div className={header()}>
        <Typography
          {...title}
          className={{
            ...title?.className,
            base: clsx(title?.className?.base, titleStyle())
          }}
        />
        <Typography
          {...subtitle}
          className={{
            ...subtitle?.className,
            base: clsx(subtitle?.className?.base, subtitleStyle())
          }}
        />
      </div>

      {!isDesktop ? (
        <ComparativeTableMobile {...props} />
      ) : (
        <ComparativeTableDesk {...props} desktop={isDesktop} titleTable={titleTable} />
      )}
    </div>
  );
};
