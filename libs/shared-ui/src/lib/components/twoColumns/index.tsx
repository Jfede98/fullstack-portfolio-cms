import type { CSSProperties, FC } from "react";
import clsx from "clsx";
import type { ITwoColumnsProps } from "@shared-ui/interfaces/twoColumns";
import {
  DEFAULT_TWO_COLUMNS_DIVIDER_COLOR,
  normalizeTwoColumnsWidths,
  sanitizeHexColor
} from "@shared-ui/helpers/twoColumns";
import { TwoColumnsStyle } from "./style";

export const TwoColumns: FC<ITwoColumnsProps> = ({
  left,
  right,
  background = "primary-50",
  className,
  showDivider = false,
  dividerColor = DEFAULT_TWO_COLUMNS_DIVIDER_COLOR,
  leftWidth,
  rightWidth
}) => {
  const { leftWidth: normalizedLeftWidth, rightWidth: normalizedRightWidth } = normalizeTwoColumnsWidths(
    leftWidth,
    rightWidth
  );
  const normalizedDividerColor = sanitizeHexColor(
    dividerColor,
    DEFAULT_TWO_COLUMNS_DIVIDER_COLOR
  );
  const hasCustomWidths = Boolean(normalizedLeftWidth || normalizedRightWidth);

  const { base, container, left: leftStyle, right: rightStyle, divider } = TwoColumnsStyle({
    background,
    customWidths: hasCustomWidths,
    showDivider
  });

  const leftColumnStyle = normalizedLeftWidth
    ? ({ "--two-columns-left-width": normalizedLeftWidth } as CSSProperties)
    : undefined;

  const rightColumnStyle = normalizedRightWidth
    ? ({ "--two-columns-right-width": normalizedRightWidth } as CSSProperties)
    : undefined;

  return (
    <section className={clsx(base(), className?.base)} data-testid="two-columns">
      <div className={clsx(container(), className?.container)}>
        <div
          className={clsx(
            leftStyle(),
            normalizedLeftWidth &&
              "lg:shrink lg:basis-[var(--two-columns-left-width)] lg:max-w-[var(--two-columns-left-width)]",
            hasCustomWidths && "lg:[&>*]:w-full lg:[&>*]:max-w-none",
            className?.left
          )}
          style={leftColumnStyle}
        >
          {left}
        </div>

        {showDivider && (
          <div
            className={clsx(divider(), className?.divider)}
            style={{ backgroundColor: normalizedDividerColor }}
            aria-hidden
          />
        )}

        <div
          className={clsx(
            rightStyle(),
            normalizedRightWidth &&
              "lg:shrink lg:basis-[var(--two-columns-right-width)] lg:max-w-[var(--two-columns-right-width)]",
            hasCustomWidths && "lg:[&>*]:w-full lg:[&>*]:max-w-none",
            className?.right
          )}
          style={rightColumnStyle}
        >
          {right}
        </div>
      </div>
    </section>
  );
};
