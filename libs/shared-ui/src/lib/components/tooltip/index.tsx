import { useState, type FC } from "react";
import type { TooltipProps } from "@shared-ui/interfaces/tooltip";
import { tooltipStyles } from "./style";

export const Tooltip: FC<TooltipProps> = ({
  content,
  children,
  size = "md",
  side = "top"
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const styles = tooltipStyles({ side, size });

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      {isVisible && (
        <div className={styles} role="tooltip">
          {content}
        </div>
      )}
    </div>
  );
};
