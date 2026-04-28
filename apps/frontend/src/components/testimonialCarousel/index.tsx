"use client";
import { planCarouselStyle } from "@components/testimonialCarousel/style";
import type { IPlanCarouselProps } from "@interfaces/planCarousel";
import { useMemo, type FC } from "react";
import { Header } from "./header";
import { CarouselTestimonial } from "./carousel";
import { Icon } from "@sitio-publico/shared-ui";

export const TestimonialCarousel: FC<IPlanCarouselProps> = ({
  title,
  description,
  button,
  testimonials,
  features
}) => {
  const { 
    section, 
    wrapper, 
    horizontalLayout, 
    testimonialsSection, 
    featuresSection,
    featureItem,
    featureIcon,
    featureContent,
    featureTitle,
    featureDescription
  } = planCarouselStyle();
  const data = useMemo(() => testimonials, [testimonials]);
  const hasFeatures = features && features.length > 0;

  if (hasFeatures) {
    return (
      <section className={section()}>
        <div className={wrapper()}>
          <div className={horizontalLayout()}>
            <div className={testimonialsSection()}>
              <Header title={title} description={description} button={button} />
              <CarouselTestimonial data={data} compact={true} />
            </div>
            <div className={featuresSection()}>
              {features?.map((feature, index) => (
                <div key={index} className={featureItem()}>
                  <div className={featureIcon()}>
                    <Icon
                      name={feature.icon}
                      size="xl"
                      color="text-primary-500"
                      type="outlined"
                    />
                  </div>
                  <div className={featureContent()}>
                    <div className={featureTitle()}>
                      {feature.title}
                    </div>
                    <div className={featureDescription()}>
                      {feature.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={section()}>
      <div className={wrapper()}>
        <Header title={title} description={description} button={button} />
        <CarouselTestimonial data={data} />
      </div>
    </section>
  );
};
