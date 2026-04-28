import type { FC } from "react";
import { Card } from "@shared-ui/components/cards/base";
import { Icon } from "@shared-ui/components/icons";
import { ListCardStyle } from "./style";
import type { IListCardProps } from "@shared-ui/interfaces/cards/listCard";
import clsx from "clsx";

export const ListCard: FC<IListCardProps> = ({
  title,
  items,
  className
}) => {
  const { container, title: titleStyle, list, listItem, iconWrapper, itemText } = ListCardStyle();

  return (
    <Card
      className={{ base: clsx(container(), className?.container) }}
      backgroundColor="white"
      border="white"
      dataTestid="list-card-wrapper"
    >
      <h3
        className={clsx(titleStyle(), className?.title)}
        style={{ color: '#1B263B' }}
        data-testid="list-card-title"
      >
        {title}
      </h3>

      <ul className={clsx(list(), className?.list)}>
        {items.map((item, index) => (
          <li key={index} className={clsx(listItem(), className?.listItem)}>
            <div 
              className={clsx(iconWrapper(), className?.iconWrapper)}
              style={{ backgroundColor: '#D7DAE1' }}
            >
              <Icon
                name="check_circle"
                type="rounded"
                size="msm"
                color="text-[#83378F]"
                dataTestid={`list-card-icon-${index}`}
              />
            </div>
            <span
              className={clsx(itemText(), className?.itemText)}
              style={{ color: '#6A7180' }}
              data-testid={`list-card-item-${index}`}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
};
