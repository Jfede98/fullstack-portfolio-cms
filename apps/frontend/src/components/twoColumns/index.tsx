import type { FC } from "react";
import { TwoColumns as SharedTwoColumns } from "@shared-ui/components/twoColumns";
import type { ITwoColumnsBlockProps } from "@interfaces/components/twoColumns";
import { CityMapBridge } from "@components/providers/cityMapBridge";

export const TwoColumnsBlock: FC<ITwoColumnsBlockProps> = ({
  leftContent,
  rightContent,
  backgroundVariant = "primary-50",
  showDivider,
  dividerColor,
  leftWidth,
  rightWidth,
  className
}) => {
  return (
    <CityMapBridge>
      <SharedTwoColumns
        background={backgroundVariant}
        showDivider={showDivider}
        dividerColor={dividerColor}
        leftWidth={leftWidth}
        rightWidth={rightWidth}
        left={leftContent ?? null}
        right={rightContent ?? null}
        className={{
          ...className,
          left: ["[&_.ui-benefits]:py-0 [&_.ui-benefits]:px-0", className?.left]
            .filter(Boolean)
            .join(" ")
        }}
      />
    </CityMapBridge>
  );
};
