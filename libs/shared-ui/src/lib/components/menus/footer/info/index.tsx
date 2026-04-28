import { type FC } from "react";
import { FooterInfoStyle } from "./style";
import type { IExtraInfo } from "@shared-ui/interfaces/menus/footer";

export const InfoFooter: FC<IExtraInfo> = ({ items }) => {
  const { containerInfo, containerAddress, addressStyle } = FooterInfoStyle();

  if (!items || items.length === 0) return null;

  return (
    <div className={containerInfo()}>
      {items.map((item, index) => (
        <div key={index} className={containerAddress()}>
          {item.label && <span className={addressStyle()}>{item.label}</span>}
          {item.content && (
            <span className={addressStyle()}>{item.content}</span>
          )}
        </div>
      ))}
    </div>
  );
};
