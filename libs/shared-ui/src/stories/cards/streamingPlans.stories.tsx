import type { Meta, StoryObj } from "@storybook/react-vite";
import { StreamingPlans } from "../../lib/components/cards/streamingPlans";
import Img1 from "../../assets/svg/Zapping.svg";
import Img2 from "../../assets/svg/Paramount.svg";

const description = `
El componente **StreamingPlans** muestra una seccion con titulo, subtitulo y tarjetas de planes de streaming.

#### Caracteristicas principales:
- **Seccion completa**: Titulo, subtitulo y tarjetas en un solo componente
- **Tarjetas configurables**: Imagen, badge opcional, titulo, descripcion y CTAs
- **Reutiliza Button y Badge**: Permite personalizar estilos con \`className\`
- **Responsive**: Disposicion en columna, fila o carrusel segun configuracion
`;

const meta = {
  component: StreamingPlans,
  title: "Cards/StreamingPlans/Group",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: description
      }
    }
  },
  argTypes: {
    title: {
      description: "Titulo principal de la seccion (objeto con text y tag)",
      control: "object",
      table: {
        category: "Display"
      }
    },
    subtitle: {
      description: "Texto secundario (objeto con text y tag)",
      control: "object",
      table: {
        category: "Display"
      }
    },
    plans: {
      description: "Listado de planes a mostrar",
      control: "object",
      table: {
        category: "Data"
      }
    },
    layout: {
      description: "Configura grid o carrusel por breakpoint",
      control: "object",
      table: {
        category: "Layout"
      }
    },
    carousel: {
      description: "Props para carrusel en mobile y desktop",
      control: "object",
      table: {
        category: "Layout"
      }
    },
    className: {
      description: "Clases personalizadas por slot",
      control: "object",
      table: {
        category: "Styles",
        type: {
          summary: "IStreamingPlansClassName"
        }
      }
    }
  }
} satisfies Meta<typeof StreamingPlans>;

export default meta;
type Story = StoryObj<typeof meta>;

const samplePlans = [
  {
    title: "Zapping",
    description: "Disfruta tus canales favoritos con la mejor calidad.",
    image: {
      src: Img1,
      alt: "Zapping"
    },
    badgeText: "Nuevo",
    ctas: [
      {
        label: "Contratar ahora",
        href: "#"
      },
      {
        label: "Contratar por WhatsApp",
        href: "https://wa.me/1234567890",
        icon: "WhatsappVector"
      }
    ]
  },
  {
    title: "HBO Max",
    description: "Series y peliculas premium para toda la familia.",
    image: {
      src: Img2,
      alt: "HBO Max"
    },
    ctas: [
      {
        label: "Contratar ahora",
        href: "#"
      },
      {
        label: "Contratar por WhatsApp",
        href: "https://wa.me/1234567890",
        icon: "WhatsappVector"
      }
    ]
  },
  {
    title: "Paramount+",
    description: "Contenido exclusivo y estrenos imperdibles.",
    image: {
      src: Img2,
      alt: "Paramount+"
    },
    ctas: [
      {
        label: "Contratar ahora",
        href: "#"
      },
      {
        label: "Contratar por WhatsApp",
        href: "https://wa.me/1234567890",
        icon: "WhatsappVector"
      }
    ]
  }
];

const samplePlansExtended = [
  ...samplePlans,
  {
    title: "Disney+",
    description: "Todo el universo Disney, Pixar, Marvel y Star Wars.",
    image: {
      src: Img1,
      alt: "Disney+"
    },
    badgeText: "Popular",
    ctas: [
      {
        label: "Contratar ahora",
        href: "#"
      },
      {
        label: "Contratar por WhatsApp",
        href: "https://wa.me/1234567890",
        icon: "WhatsappVector"
      }
    ]
  },
  {
    title: "Netflix",
    description: "Las mejores series y películas en un solo lugar.",
    image: {
      src: Img2,
      alt: "Netflix"
    },
    ctas: [
      {
        label: "Contratar ahora",
        href: "#"
      },
      {
        label: "Contratar por WhatsApp",
        href: "https://wa.me/1234567890",
        icon: "WhatsappVector"
      }
    ]
  },
  {
    title: "Prime Video",
    description: "Entretenimiento ilimitado con Amazon Prime.",
    image: {
      src: Img1,
      alt: "Prime Video"
    },
    badgeText: "Oferta",
    ctas: [
      {
        label: "Contratar ahora",
        href: "#"
      },
      {
        label: "Contratar por WhatsApp",
        href: "https://wa.me/1234567890",
        icon: "WhatsappVector"
      }
    ]
  }
];

export const GridOnly: Story = {
  args: {
    title: {
      text: "Planes de Internet con Servicios de Streaming",
      tag: "h2"
    },
    subtitle: {
      text: "Encuentra el streaming ideal para ti",
      tag: "p"
    },
    layout: {
      mobile: "grid",
      desktop: "grid"
    },
    plans: samplePlans
  },
  parameters: {
    docs: {
      description: {
        story: "Solo grid para mobile y desktop."
      }
    }
  }
};

export const CarouselOnly: Story = {
  args: {
    title: {
      text: "Planes de Internet con Servicios de Streaming",
      tag: "h2"
    },
    subtitle: {
      text: "Encuentra el streaming ideal para ti",
      tag: "p"
    },
    layout: {
      mobile: "carousel",
      desktop: "carousel"
    },
    carousel: {
      mobile: {
        slidesPerView: 1.05,
        spaceBetween: 16,
        navigation: {
          type: "arrows",
          hiddenArrowOnFirstAndLast: true,
          leftArrow: { size: "md" },
          rightArrow: { size: "md" }
        }
      },
      desktop: {
        slidesPerView: 3,
        spaceBetween: 30,
        navigation: {
          type: "arrows",
          hiddenArrowOnFirstAndLast: true,
          leftArrow: { size: "md" },
          rightArrow: { size: "md" }
        }
      }
    },
    plans: samplePlans
  },
  parameters: {
    docs: {
      description: {
        story:
          "Solo carrusel, con flechas en mobile y desktop."
      }
    }
  }
};

export const Mixed: Story = {
  args: {
    title: {
      text: "Planes de Internet con Servicios de Streaming",
      tag: "h2"
    },
    subtitle: {
      text: "Encuentra el streaming ideal para ti",
      tag: "p"
    },
    layout: {
      mobile: "carousel",
      desktop: "grid"
    },
    carousel: {
      mobile: {
        slidesPerView: 1.05,
        spaceBetween: 16,
        navigation: {
          type: "arrows",
          hiddenArrowOnFirstAndLast: true,
          leftArrow: { size: "md" },
          rightArrow: { size: "md" }
        }
      }
    },
    plans: samplePlansExtended
  },
  parameters: {
    docs: {
      description: {
        story:
          "Carrusel en mobile y grid en desktop con 6 elementos para ver el comportamiento con mas contenido."
      }
    }
  }
};
