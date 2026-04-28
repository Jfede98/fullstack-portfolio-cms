import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../lib/components";

const description = `El componente **Badge** se utiliza para resaltar el estado de un elemento, categorizar contenido o mostrar etiquetas informativas rápidas. 
#### Características clave:
- **Variantes de Color**: Soporta múltiples estados visuales (Primary, Secondary, Success, Warning, etc.) alineados con el sistema de diseño.
- **isFeatured**: Una variante especial con bordes redondeados completos (*pill style*) para destacar elementos populares o promociones.
- **Composicón**: Diseñado para ser visualmente ligero y adaptarse a contenedores pequeños como tarjetas de planes o encabezados.

#### Uso recomendado:
Se debe utilizar para textos cortos de una sola palabra o frases muy breves. No se recomienda incluir iconos grandes o párrafos dentro del componente.`;

const meta = {
  component: Badge,
  title: "Layout/Badge",
  tags: ["autodocs"],
  excludeStories: /Data$/,
  parameters: {
    docs: {
      description: {
        component: description
      }
    }
  },
  argTypes: {
    text: {
      description: "Texto de la etiqueta",
      control: "text",
      table: {
        category: "Display",
        defaultValue: {}
      }
    },
    color: {
      description: "Variante de color del botón",
      control: "select",
      options: ["primary", "secondary", "outline"],
      table: {
        category: "Styles",
        defaultValue: { summary: "primary" }
      }
    },
    isFeatured: {
      description:
        "Si es verdadero, aplica un radio de borde circular (estilo píldora).",
      control: "boolean",
      table: {
        category: "Styles",
        defaultValue: { summary: "false" }
      }
    },
    className: {
      control: { type: "object" },
      table: {
        category: "Styles",
        defaultValue: {}
      },
      description: "Objeto con la clase base"
    }
  }
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: { base: "" },
    text: "Label",
    color: "primary",
    isFeatured: false
  },
  parameters: {
    docs: {
      description: {
        story:
          "Estado inicial del componente Badge con la configuración mínima recomendada."
      }
    }
  }
};

export const Primary: Story = {
  args: {
    className: { base: "" },
    text: "Label",
    color: "primary"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Variante principal de marca. Se utiliza para etiquetas de importancia general o estados activos."
      }
    }
  }
};

export const Secondary: Story = {
  args: {
    className: { base: "" },
    text: "Label",
    color: "secondary"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Variante neutra. Ideal para categorías o etiquetas informativas que no deben competir visualmente con el botón principal."
      }
    }
  }
};

export const Orange: Story = {
  args: {
    className: { base: "" },
    text: "Label",
    color: "orange"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Utilizada comúnmente para advertencias, estados pendientes o niveles de atención intermedios."
      }
    }
  }
};

export const Green: Story = {
  args: {
    className: { base: "" },
    text: "Label",
    color: "green"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Indica éxito, confirmación, estados completados o valores positivos dentro de la interfaz."
      }
    }
  }
};

export const Yellow: Story = {
  args: {
    className: { base: "" },
    text: "Label",
    color: "yellow"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Variante de precaución o resaltado suave. Útil para llamar la atención sobre cambios temporales."
      }
    }
  }
};

export const Featured: Story = {
  args: {
    className: { base: "" },
    text: "MÁS POPULAR",
    isFeatured: true,
    color: "primary"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Versión destacada con estilo *pill* (bordes redondeados completos). Diseñada para resaltar promociones o elementos preferidos por los usuarios."
      }
    }
  }
};
