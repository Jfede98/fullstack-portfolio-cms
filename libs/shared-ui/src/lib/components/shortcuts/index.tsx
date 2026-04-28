import { Icon } from "@shared-ui/components/icons";
import { shortcutStyle } from "./style";
import { Link } from "@shared-ui/components/link";
import type { IShortcutsProps } from "@shared-ui/interfaces/shortcuts";
import clsx from "clsx";

export const Shortcuts = ({
  items,
  className,
  iconProps = { color: "text-primary", type: "rounded", size: "md" },
  arrowIconProps
}: IShortcutsProps) => {
  const styles = shortcutStyle();

  return (
    <div className={clsx(styles.base(), className?.base)}>
      {items.map((shortcut, index) => (
        <div
          className={clsx(styles.itemContainer(), className?.itemContainer)}
          key={`${index}-${shortcut.title}`}
        >
          <Link
            href={shortcut.href || "#"}
            className={{ base: clsx(styles.link(), "group", className?.link) }}
          >
            <Icon
              name={shortcut.icon}
              className={{ base: clsx(styles.icon(), className?.icon) }}
              {...iconProps}
            />
            <span className={clsx(styles.text(), className?.text)}>
              {shortcut.title}
            </span>
            <Icon
              name={"keyboard_arrow_right"}
              className={{ base: clsx(styles.arrow(), className?.arrow) }}
              {...arrowIconProps}
            />
          </Link>
        </div>
      ))}
    </div>
  );
};
