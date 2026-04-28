import type { ComparativeTablePlan } from "@shared-ui/interfaces/table/comparativeTable";
import type { FC } from "react";
import { Button } from "@shared-ui/components/button";
import { PlanComparativeStyles } from "./style";
import { Typography } from "@shared-ui/components/typography";

export const PlanComparativeTable: FC<
  ComparativeTablePlan & { label?: string; desktop?: boolean }
> = ({ prevPrice, price, buttons, label, desktop = false }) => {
  const {
    base,
    buttonContainer,
    headerContainer,
    titleStyle,
    prevPriceLabel,
    priceLabel
  } = PlanComparativeStyles({ isDesktop: desktop });

  return (
    <div className={base()}>
      {desktop && (
        <Typography
          tag="span"
          variant="title"
          type="bold"
          className={{ base: titleStyle() }}
        >
          {label}
        </Typography>
      )}
      <div className={headerContainer()}>
        {price && (
          <Typography
            className={{ base: priceLabel() }}
            tag="strong"
            variant={!desktop ? "subtitle" : "body"}
            type={!desktop ? "bold" : "regular"}
          >
            ${price?.toFixed(2)} + imp.
          </Typography>
        )}
        {prevPrice && !desktop && (
          <Typography
            className={{ base: prevPriceLabel() }}
            tag="span"
            variant="legal"
          >
            ${prevPrice?.toFixed(2)} + imp.
          </Typography>
        )}
      </div>
      <div className={buttonContainer()}>
        {buttons?.map((button, idx) => (
          <Button key={idx} {...button} className={{ base: "h-8" }} />
        ))}
      </div>
    </div>
  );
};
