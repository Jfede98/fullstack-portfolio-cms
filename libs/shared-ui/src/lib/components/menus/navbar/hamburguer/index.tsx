import { type FC } from "react";
import { motion } from "framer-motion";
import { HamburguerNavbarStyle } from "./style";
import type { IHamburguerProps } from "@shared-ui/interfaces/menus/navbar";

export const HamburguerNavbar: FC<IHamburguerProps> = ({ isOpen, onClose }) => {
  const { base, line, wrapperLine } = HamburguerNavbarStyle();

  return (
    <button className={base()} onClick={onClose} aria-label="Menu">
      <div className={wrapperLine()}>
        <motion.span
          className={line()}
          animate={isOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className={line()}
          style={{ y: 9 }}
          animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className={line()}
          style={{ y: 18 }}
          animate={isOpen ? { rotate: -45, y: 9 } : { rotate: 0, y: 18 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </button>
  );
};
