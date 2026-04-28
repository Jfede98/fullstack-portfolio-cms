import { useState, type FC } from "react";
import type { IAccordionProps } from "@shared-ui/interfaces/accordion";
import { Dropdown } from "@shared-ui/components/dropdown";
import { AccordionStyle } from "./style";
import { MarkdownItem } from "../markdown";
import { Link } from "@shared-ui/components/link";
import clsx from "clsx";

export const Accordion: FC<IAccordionProps> = ({
  items,
  variant,
  isExclusive = false,
  linkProps,
  className,
  markdownVariant = 'default'
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const { base, dropdown, titleStyle, dropdownTrigger, descStyle } =
    AccordionStyle({ variant });

  return (
    <div className={clsx(base(), className?.base)}>
      {items.map((item, idx) => {
        const active = isExclusive && openIndex === idx;

        return item.link ? (
          <Link key={idx} {...item.link} href={item.link?.href}>
            {item.title}
          </Link>
        ) : (
          <Dropdown
            key={idx}
            hiddenArrowIcon={item?.hiddenArrowIcon}
            contentPosition="inline"
            className={{
              base: clsx(dropdown({ active }), className?.dropdown?.base),
              trigger: clsx(dropdownTrigger(), className?.dropdown?.trigger),
              content: "bg-transparent shadow-none border-0"
            }}
            trigger={
              <span className={clsx(titleStyle(), className?.dropdown?.title)}>
                {item.title}
              </span>
            }
            content={
              item.children ? (
                item.children
              ) : (
                <div className={clsx(descStyle(), className?.dropdown?.desc)}>
                  {
                    <MarkdownItem
                      desc={item.description!}
                      linkProps={linkProps}
                      className={className?.mardown}
                      variant={markdownVariant}
                    />
                  }
                </div>
              )
            }
            active={isExclusive ? openIndex === idx : undefined}
            onActive={(isActive) => {
              if (!isExclusive) return;
              setOpenIndex(isActive ? idx : null);
            }}
          />
        );
      })}
    </div>
  );
};
