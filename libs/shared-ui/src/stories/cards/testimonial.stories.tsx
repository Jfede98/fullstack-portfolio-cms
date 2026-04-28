import type { Meta, StoryObj } from "@storybook/react-vite";
import { TestimonialCard } from "../../lib/components/cards/testimonial";

const description = `El componente **TestimonialCard** se utiliza para mostrar testimonios de usuarios o clientes en un formato atractivo y fácil de leer.
 
#### Características clave:
- **Diseño Atractivo**: Presenta el testimonio de manera destacada, con espacio para el texto y detalles del autor.
- **Rating de Estrellas**: Muestra un rating visual de 0 a 5 estrellas, permitiendo medias estrellas (0.5, 1.5, 2.5, etc.).
- **Composición con Card**: Utiliza el componente base \`Card\` internamente, heredando sus estilos fundamentales.
- **Helper getRatingStars**: Utiliza una función helper que convierte el rating numérico en iconos de estrellas (completas, medias y vacías).`;

const meta = {
  component: TestimonialCard,
  title: "Cards/TestimonialCard",
  tags: ["autodocs"],
  excludeStories: /Data$/,
  argTypes: {
    rating: {
      table: {
        category: "Content",
        type: { summary: "number" },
      },
      control: { type: "select" },
      options: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
      description: "Rating de 0 a 5, permitiendo incrementos de 0.5. Se renderiza usando el helper `getRatingStars` que convierte el número en iconos."
    },
    text: {
      table: {
        category: "Content",
        type: { summary: "string" }
      },
      control: "text",
      description: "Texto del testimonio. Contenido principal que muestra la opinión del usuario."
    },
    author: {
      table: {
        category: "Content",
        type: { summary: "string" }
      },
      control: "text",
      description: "Nombre del autor del testimonio. Se muestra al final de la tarjeta precedido por un guión."
    },
    icon: {
      control: "object",
      description: "Objeto con propiedades del icono de estrellas (type, size, color). Permite personalizar las estrellas del rating. Hereda las variantes de IconStyle.",
      table: {
        category: "Icon",
        type: {
          summary: "IIconStyleProps",
          detail: "{ type?: 'outlined' | 'rounded' | 'filled', size?: 'msm' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', color?: string }"
        },
        defaultValue: {
          summary: "{ type: 'outlined', size: 'sm' }"
        }
      }
    },
    className: {
      control: "object",
      description: "Objeto con clases CSS para personalizar diferentes partes del componente.",
      table: {
        category: "Styles",
        type: {
          summary: "ITestimonialCardClassName",
          detail: "{ container?: string, stars?: string, text?: string, author?: string }"
        }
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
} satisfies Meta<typeof TestimonialCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rating: 5,
    text: "Lorem ipsum doxlor sit amet conse ctetur adipiscing lectus a nunc mauris scelerisque sed egestas pharetraol quis pharetra arcu pharetra blandit.",
    author: "María González"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Configuración estándar de la tarjeta de testimonio con 5 estrellas completas."
      }
    }
  }
};

export const HalfRating: Story = {
  args: {
    rating: 2.5,
    text: "Excelente servicio, aunque hay algunas áreas de mejora. En general, muy satisfecho con la atención recibida.",
    author: "Juan Pérez"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo con rating de 2.5 estrellas, mostrando una media estrella."
      }
    }
  }
};

export const FourAndHalf: Story = {
  args: {
    rating: 4.5,
    text: "Muy buena experiencia, el equipo es profesional y atento. Recomiendo sus servicios ampliamente.",
    author: "Ana Martínez"
  },
  parameters: {
    docs: {
      description: {
        story: "Ejemplo con rating de 4.5 estrellas."
      }
    }
  }
};

export const ThreeStars: Story = {
  args: {
    rating: 3,
    text: "Servicio adecuado, cumple con las expectativas básicas. Hay espacio para mejorar.",
    author: "Carlos López"
  },
  parameters: {
    docs: {
      description: {
        story: "Ejemplo con rating de 3 estrellas completas."
      }
    }
  }
};

export const WithCustomIcon: Story = {
  args: {
    rating: 5,
    text: "Producto de excelente calidad, superó mis expectativas en todos los aspectos.",
    author: "Laura Fernández",
    icon: {
      type: "filled",
      size: "lg",
      color: "text-yellow-400"
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Ejemplo con iconos de estrellas personalizados usando `icon`. Cambia el tipo (filled), tamaño (lg) y color (yellow-400) de las estrellas."
      }
    }
  }
};

export const WithCustomStyles: Story = {
  args: {
    rating: 5,
    text: "Excelente servicio con atención personalizada. Superó todas mis expectativas.",
    author: "Roberto Sánchez",
    icon: {
      type: "rounded",
      size: "md",
      color: "text-orange-500"
    },
    className: {
      container: "bg-gradient-to-br from-primary-50 to-white border-primary-300 shadow-xl",
      stars: "mb-6",
      text: "text-lg italic text-gray-700",
      author: "text-primary-600 font-bold text-base"
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Ejemplo completo con iconos y estilos personalizados. Combina `icon` para personalizar las estrellas y `className` para los estilos del contenedor."
      }
    }
  }
};
