import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "../../lib/components/cards/base";

const description = `El componente **Card** es un componente base que proporciona el contenedor y estilos fundamentales para todas las tarjetas del sistema.

#### Características clave:
- **Reutilizable**: Base común para AttentionCard, TestimonialCard y futuras cards.
- **Consistencia**: Garantiza estilos uniformes (fondo blanco, bordes redondeados, borde gris).
- **Flexible**: Acepta children y className como objeto para personalización (patrón similar a Button).
- **Variantes**: Soporta diferentes estilos de borde (\`white\`, \`gray\`) y fondo (\`white\`, \`none\`).
- **Navegación**: Puede funcionar como enlace usando la prop \`href\`.
- **Composición**: Sigue el patrón de composición de React para máxima flexibilidad.
- **Type-safe**: Uso de \`clsx\` para combinar clases de forma segura y eficiente.`;

const meta = {
  component: Card,
  title: "Cards/Card (Base)",
  tags: ["autodocs"],
  excludeStories: /Data$/,
  argTypes: {
    children: {
      table: { category: "Display" },
      control: false,
      description: "Contenido de la tarjeta"
    },
    className: {
      control: "object",
      description:
        "Objeto con clases CSS para personalizar el contenedor. Propiedad `base` para el contenedor principal.",
      table: {
        category: "Styles",
        type: {
          summary: "ICardClassName",
          detail: "{ base?: string }"
        }
      }
    },
    border: {
      control: "select",
      options: ["white", "gray"],
      description:
        "Estilo del borde. `gray` incluye borde gris con sombra, `white` usa borde blanco sin sombra.",
      table: {
        category: "Variants",
        type: { summary: "string" },
        defaultValue: { summary: "gray" }
      }
    },
    backgroundColor: {
      control: "select",
      options: ["white", "none"],
      description:
        "Color de fondo. `white` para fondo blanco, `none` para fondo transparente.",
      table: {
        category: "Variants",
        type: { summary: "string" },
        defaultValue: { summary: "white" }
      }
    },
    href: {
      control: "text",
      description: "URL de destino. Cuando se proporciona el parámetro href",
      table: {
        category: "Navigation",
        type: { summary: "string" }
      }
    }
  },
  parameters: {
    background: {
      default: "black"
    },
    docs: {
      description: {
        component: description
      }
    }
  }
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold">Card Base</h3>
        <p className="text-gray-600">
          Este es el componente base usado por todas las cards del sistema.
        </p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Card base con contenido personalizado simple usando los estilos por defecto (sin `className` personalizado)."
      }
    }
  }
};

export const WithCustomPadding: Story = {
  args: {
    className: { base: "p-8 gap-4" },
    children: (
      <>
        <h3 className="text-primary-500 text-2xl font-bold">Título</h3>
        <p className="text-gray-600">
          Ejemplo de card con padding y gap personalizados usando className.
        </p>
        <button className="bg-primary-500 rounded-lg px-4 py-2 text-white">
          Acción
        </button>
      </>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Card con clases CSS adicionales para personalizar el espaciado interno usando `className.base`."
      }
    }
  }
};

export const WithWhiteBorder: Story = {
  args: {
    border: "white",
    children: (
      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold">Card con Borde Blanco</h3>
        <p className="text-gray-600">
          Esta card usa un borde blanco sin sombra, ideal para fondos de color.
        </p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Card con borde blanco, sin sombra. Útil para usar sobre fondos de color o imágenes."
      }
    },
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#1a202c" }]
    }
  }
};

export const WithTransparentBackground: Story = {
  args: {
    backgroundColor: "none",
    border: "gray",
    children: (
      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold">Card con Fondo Transparente</h3>
        <p className="text-gray-600">
          Esta card tiene fondo transparente, mostrando solo el borde y
          contenido.
        </p>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story:
          "Card con fondo transparente (`backgroundColor='none'`), manteniendo el borde. Ideal para superposiciones o diseños minimalistas."
      }
    },
    backgrounds: {
      default: "dark-gradient",
      values: [
        {
          name: "dark-gradient",
          value: "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)"
        }
      ]
    }
  }
};

export const AsLink: Story = {
  args: {
    href: "https://www.xtrim.com.ec",
    children: (
      <div className="p-6">
        <h3 className="text-primary-600 mb-2 text-xl font-bold">Card Enlace</h3>
        <p className="text-gray-600">
          Haz clic en esta card para navegar a otra página. Se renderiza como un
          enlace &lt;a&gt;.
        </p>
        <span className="text-primary-500 mt-2 block text-sm font-medium">
          → Ver más
        </span>
      </div>
    )
  },
  argTypes: {
    href: {
      table: { category: "Navigation" },
      description: "URL de destino para el enlace"
    },
    children: {
      table: { category: "Display" },
      description: "Contenido de la card clickeable"
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Card que funciona como enlace usando la prop `href`. Se renderiza como `<a>` en lugar de `<div>`, permitiendo navegación al hacer clic en cualquier parte de la card."
      }
    }
  }
};
