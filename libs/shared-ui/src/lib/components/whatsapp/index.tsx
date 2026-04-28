import { type FC } from "react";
import type { IWhatsAppProps } from "@shared-ui/interfaces/whatsapp";
import { Link } from "@shared-ui/components/link";
import { WhatsAppStyle } from "./style";
import clsx from "clsx";
import { WhatsappIcon } from "./icon";

export const WhatsApp: FC<IWhatsAppProps> = ({
  className,
  phoneNumber,
  text,
  ...props
}) => {
  const { base, imgStyle, textStyle } = WhatsAppStyle();

  return (
    <Link
      {...props}
      href={`https://wa.me/${phoneNumber}?text=${text}`}
      className={{ base: clsx(base(), className?.base) }}
      target="_blank"
    >
      <span className={clsx(className?.text, textStyle())}>
        ¿Necesitas ayuda?
      </span>
      <WhatsappIcon className={clsx(className?.img, imgStyle())} />
    </Link>
  );
};
