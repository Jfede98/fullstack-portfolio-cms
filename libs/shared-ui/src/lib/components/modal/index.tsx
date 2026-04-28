import { type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModalStyle } from "./style";
import type { IModalProps } from "@shared-ui/interfaces/modal";
import clsx from "clsx";
import { CloseButton } from "./closeButton";

export const Modal: FC<IModalProps> = ({
  isOpen,
  onClose,
  children,
  size = "md",
  showCloseButton = true,
  className
}) => {
  if (typeof window === "undefined") return null;

  const { overlay, content, body } = ModalStyle({ size });

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className={clsx(overlay(), className?.overlay)}
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={clsx(content(), className?.base)}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300
            }}
            role="dialog"
            aria-modal="true"
          >
            {showCloseButton && <CloseButton onClose={onClose} />}
            <div className={clsx(body(), className?.body)}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
