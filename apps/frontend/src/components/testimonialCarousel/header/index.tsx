import { useTestimonialCarousel } from "@hooks/useTestimonialCarousel";
import { headerStyle } from "./style";
import { Button, Typography } from "@sitio-publico/shared-ui";
import { type FC } from "react";
import type { IPlanCarouselProps } from "@interfaces/planCarousel";

type Props = Pick<IPlanCarouselProps, "title" | "description" | "button">;

export const Header: FC<Props> = ({ title, description, button }) => {
  const { handlerCtaButton } = useTestimonialCarousel();
  const { topContainer, textContainer, buttonStyle } = headerStyle();

  return (
    <div className={topContainer()}>
      <div className={textContainer()}>
        {title?.text && (
          <Typography
            small
            tag={title?.tag ?? "h2"}
            type="regular"
            variant="hero"
          >{title.text}</Typography>
        )}
        {description && (
          <Typography
            tag="p"
            type="regular"
            variant="body"
          >{description}</Typography>
        )}
      </div>
      {button?.label && (
        <Button
          size={button.size}
          color={button.variant}
          href={button.href}
          target={button.target}
          type={button.href ? "link" : "button"}
          onClick={() => handlerCtaButton(button)}
          className={{ base: buttonStyle() }}
        >
          {button.label}
        </Button>
      )}
    </div>
  );
};
