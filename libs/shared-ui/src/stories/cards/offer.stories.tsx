import type { Meta, StoryObj } from "@storybook/react-vite";
import { OfferCard } from "../../lib/components";
import Img from "../../assets/img/dump-offer.png";

const description = `
El componente **OfferCard** es una tarjeta promocional diseñada para captar la atención del usuario mediante un equilibrio entre contenido visual y llamados a la acción (CTA).

### Características:
- **Impacto Visual**: Optimizado para mostrar imágenes de alta calidad que cubren el área de la tarjeta.
- **Micro-copy**: Estructurado con un título jerárquico y una descripción breve para facilitar la lectura rápida.
- **Contenedor Interactivo**: Toda la tarjeta actúa como un disparador de navegación o puede contener un botón de acción específico.
- **Diseño Adaptable**: Se ajusta automáticamente al ancho de su contenedor, siendo ideal para despliegues en Grid o Sliders de promociones.
`;

const meta: Meta<typeof OfferCard> = {
  component: OfferCard,
  title: "Cards/OfferCard",
  tags: ["autodocs"],
  excludeStories: /Data$/,
  decorators: [
    (Story) => (
      <div
        style={{
          backgroundColor: "#f3f3f3",
          padding: "1rem",
          height: "100%",
        }}
      >
        <Story />
      </div>
    )
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: description
      }
    }
  },
  argTypes: {
    price: {
      description: "Precio de la oferta (opcional).",
      control: "number",
      type: { name: "number", required: false },
      table: {
        category: "Content",
        type: { summary: "number | null" },
        defaultValue: { summary: "Opcional" }
      }
    },
    title: {
      description: "Título de la oferta.",
      control: "text",
      table: { category: "Content" }
    },
    description: {
      description: "Texto secundario o detalles de la promoción.",
      control: "text",
      table: { category: "Content" }
    },
    image: {
      description: "URL de la imagen de fondo o recurso visual.",
      control: "object",
      table: { category: "Content" }
    },
    link: {
      description:
        "Objeto de configuración para la redirección del componente base.",
      control: "object",
      table: { category: "Navigation" }
    },
    offerHref: {
      description:
        "Objeto con href (URL de destino) y titleHref (texto del botón CTA como 'Ver Oferta').",
      control: "object",
      table: { category: "Navigation" }
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "45% OFF por 3 meses*",
    description:
      "Navega ultra rápido con 400 megas *aplican términos y condiciones",
    image: {
      src: Img as unknown as string
    },
    link: {
      href: "#",
      target: "_self"
    },
    offerHref: {
      href: "https://example.com/oferta",
      titleHref: "Ver Oferta"
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Vista de la tarjeta promocional con botón CTA 'Ver Oferta' que incluye ícono de flecha. El botón usa offerHref para configurar la URL de destino y el texto del link."
      }
    }
  }
};

export const WithPrice: Story = {
  args: {
    title: "45% OFF por 3 meses*",
    price: 13.10,
    description:
      "Navega ultra rápido con 400 megas *aplican términos y condiciones",
    image: {
      src: Img as unknown as string
    },
    link: {
      href: "#",
      target: "_self"
    },
    offerHref: {
      href: "https://example.com/oferta",
      titleHref: "Ver Oferta"
    }
  }
};
