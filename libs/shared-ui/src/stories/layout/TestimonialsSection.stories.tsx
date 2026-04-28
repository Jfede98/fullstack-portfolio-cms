import type { Meta, StoryObj } from "@storybook/react-vite";
import { TestimonialCard } from "../../lib/components/cards/testimonial";
import { Icon } from "../../lib/components/icons";
import { Typography } from "../../lib/components/typography";
import { Button } from "../../lib/components/button";

// Mock TestimonialsSection component
const TestimonialsSection = ({ 
  title, 
  description, 
  testimonials, 
  features, 
  button 
}: {
  title: { text: string; tag: string };
  description: string;
  testimonials: Array<{ id: number; rating: number; text: string; author: string }>;
  features?: Array<{ icon: string; title: string; description: string }>;
  button?: { children: string; variant: string };
}) => {
  const hasFeatures = features && features.length > 0;

  if (hasFeatures) {
    return (
      <section className="w-full bg-primary-50/40 py-8">
        <div className="flex flex-col items-start justify-center gap-[30px] w-full max-w-[1366px] mx-auto px-4 py-6 md:px-[71px] md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full lg:items-start">
            <div className="w-full flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                <Typography
                  tag={title.tag as any}
                  variant="h1"
                  type="regular"
                  className={{ base: "text-primary-900" }}
                >
                  {title.text}
                </Typography>
                <Typography
                  tag="p"
                  variant="body"
                  type="regular"
                  className={{ base: "text-primary-700" }}
                >
                  {description}
                </Typography>
                {button && (
                  <Button
                    color={button.variant as any}
                    size="lg"
                  >
                    {button.children}
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4">
                {testimonials.slice(0, 2).map((testimonial) => (
                  <TestimonialCard
                    key={testimonial.id}
                    rating={testimonial.rating}
                    text={testimonial.text}
                    author={testimonial.author}
                  />
                ))}
              </div>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 lg:pl-8 self-center">
              {features?.map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center gap-3 p-4 w-full">
                  <div className="bg-primary-50 rounded-lg w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <Icon
                      name={feature.icon}
                      size="xl"
                      color="text-primary-500"
                      type="outlined"
                    />
                  </div>
                  <div className="flex flex-col gap-2 items-center text-center">
                    <div className="text-primary-900 font-bold text-lg">
                      {feature.title}
                    </div>
                    <div className="text-primary-900 text-sm leading-relaxed">
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
    <section className="w-full bg-primary-50/40 py-8">
      <div className="flex flex-col items-start justify-center gap-[30px] w-full max-w-[1366px] mx-auto px-4 py-6 md:px-[71px] md:py-8">
        <div className="flex flex-col gap-6 mb-8">
          <Typography
            tag={title.tag as any}
            variant="h1"
            type="regular"
            className={{ base: "text-primary-900" }}
          >
            {title.text}
          </Typography>
          <Typography
            tag="p"
            variant="body"
            type="regular"
            className={{ base: "text-primary-700" }}
          >
            {description}
          </Typography>
          {button && (
            <Button
              color={button.variant as any}
              size="lg"
            >
              {button.children}
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              rating={testimonial.rating}
              text={testimonial.text}
              author={testimonial.author}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const description = `El componente **TestimonialsSection** muestra una sección completa de testimonios con soporte para features adicionales.

#### Características clave:
- **Layout Adaptativo**: Cambia entre layout vertical (solo testimonios) y horizontal (testimonios + features)
- **Features Opcionales**: Cuando se incluyen features, se muestra un layout de 2 columnas
- **Carousel de Testimonios**: Integra el carousel de testimonios con navegación por flechas
- **Responsive**: Se adapta a diferentes tamaños de pantalla`;

const meta = {
  component: TestimonialsSection,
  title: "Layout/TestimonialsSection",
  tags: ["autodocs"],
  excludeStories: /Data$/,
  argTypes: {
    title: {
      control: "object",
      description: "Título de la sección con texto y tag HTML",
      table: {
        category: "Content",
        type: { summary: "{ text: string; tag: string }" }
      }
    },
    description: {
      control: "text",
      description: "Descripción de la sección",
      table: {
        category: "Content",
        type: { summary: "string" }
      }
    },
    testimonials: {
      control: "object",
      description: "Array de testimonios",
      table: {
        category: "Content",
        type: { summary: "Array<Testimonial>" }
      }
    },
    features: {
      control: "object",
      description: "Array de features opcionales (activa layout horizontal)",
      table: {
        category: "Content",
        type: { summary: "Array<Feature>" }
      }
    },
    button: {
      control: "object",
      description: "Botón CTA opcional",
      table: {
        category: "Actions",
        type: { summary: "ButtonProps" }
      }
    }
  },
  parameters: {
    docs: {
      description: {
        component: description
      }
    }
  }
} satisfies Meta<typeof TestimonialsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockTestimonials = [
  {
    id: 1,
    rating: 5,
    text: "Excelente servicio, superó todas mis expectativas. El equipo es muy profesional y atento.",
    author: "María González"
  },
  {
    id: 2,
    rating: 4.5,
    text: "Muy buena experiencia, recomiendo ampliamente sus servicios. Calidad garantizada.",
    author: "Juan Pérez"
  },
  {
    id: 3,
    rating: 5,
    text: "Producto de alta calidad, entrega rápida y excelente atención al cliente.",
    author: "Ana Martínez"
  }
];

const mockFeatures = [
  {
    icon: "shield-check",
    title: "Seguridad Garantizada",
    description: "Protección completa de tus datos con encriptación de nivel bancario"
  },
  {
    icon: "clock",
    title: "Disponible 24/7",
    description: "Soporte técnico disponible las 24 horas del día, los 7 días de la semana"
  },
  {
    icon: "star",
    title: "Calidad Premium",
    description: "Servicios de la más alta calidad respaldados por años de experiencia"
  },
  {
    icon: "users",
    title: "Equipo Experto",
    description: "Profesionales altamente capacitados para brindarte la mejor atención"
  }
];

export const Default: Story = {
  args: {
    title: {
      text: "Lo que dicen nuestros clientes",
      tag: "h2"
    },
    description: "Conoce las experiencias de quienes ya confían en nosotros y han transformado su negocio con nuestras soluciones.",
    testimonials: mockTestimonials,
    button: {
      children: "Ver más testimonios",
      variant: "primary"
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Layout vertical estándar con solo testimonios, sin features adicionales."
      }
    }
  }
};

export const WithFeatures: Story = {
  args: {
    title: {
      text: "Testimonios y Beneficios",
      tag: "h2"
    },
    description: "Descubre por qué nuestros clientes nos eligen y los beneficios que obtienen con nuestros servicios.",
    testimonials: mockTestimonials,
    features: mockFeatures,
    button: {
      children: "Conocer más",
      variant: "secondary"
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Layout horizontal con testimonios en la izquierda y features en la derecha. Se activa automáticamente cuando se incluyen features."
      }
    }
  }
};

export const CompactWithFeatures: Story = {
  args: {
    title: {
      text: "¿Por qué elegirnos?",
      tag: "h3"
    },
    description: "Testimonios reales y las características que nos hacen únicos en el mercado.",
    testimonials: mockTestimonials.slice(0, 2),
    features: mockFeatures.slice(0, 2)
  },
  parameters: {
    docs: {
      description: {
        story: "Versión compacta con menos testimonios y features, ideal para secciones más pequeñas."
      }
    }
  }
};