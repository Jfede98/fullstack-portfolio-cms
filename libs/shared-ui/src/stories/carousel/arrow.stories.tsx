import type { Meta, StoryObj } from "@storybook/react-vite";
import { Arrow } from "../../lib/components/carousel/arrow";

const description = `
El componente **Arrow** es un elemento de navegación diseñado específicamente para controladores de carrusel o sliders. Proporciona una interfaz visual intuitiva para el desplazamiento de contenido.

#### Características:
- **Navegación Bidireccional**: Configurable para orientaciones izquierda o derecha mediante la propiedad \`direction\`.
- **Arquitectura de Slots**: Permite personalizar de forma independiente el contenedor (\`base\`) y el glifo (\`icon\`) a través del objeto \`className\`.
- **Escala Proporcional**: Los tamaños (\`sm\` a \`xl\`) ajustan tanto el contenedor como el grosor y dimensiones del icono interno para mantener la armonía visual.
`;

const meta = {
  component: Arrow,
  title: "Carousel/Arrow",
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
    id: {
      description: "Identificador único del elemento.",
      control: "text",
      table: { category: "Content" }
    },
    direction: {
      description: "Dirección del icono.",
      control: "radio",
      options: ["left", "right"],
      table: { category: "Content" }
    },
    disabled: {
      description: "Deshabilita el componente.",
      control: "boolean",
      table: { category: "Content" }
    },
    size: {
      description: "Tamaño del elemento.",
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      table: { category: "Styles" }
    },
    className: {
      control: "object",
      description: "Clases CSS personalizadas.",
      table: {
        category: "Styles",
        defaultValue: { summary: "'{base: '', icon: ''}'" }
      }
    }
  }
} satisfies Meta<typeof Arrow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: { base: "", icon: "" },
    id: "arrow-default",
    size: "md",
    direction: "left",
    disabled: false
  },
  parameters: {
    docs: {
      description: {
        story: "Configuración estándar del componente Arrow con orientación hacia la izquierda y tamaño mediano."
      }
    }
  }
};

export const Left: Story = {
  args: { direction: "left", id: "arrow-l" },
  parameters: {
    docs: {
      description: {
        story: "Variante orientada a la izquierda, comúnmente utilizada para la acción de 'Retroceder' o 'Anterior'."
      }
    }
  }
};

export const Right: Story = {
  args: { direction: "right", id: "arrow-r" },
  parameters: {
    docs: {
      description: {
        story: "Variante orientada a la derecha, utilizada para la acción de 'Avanzar' o 'Siguiente'."
      }
    }
  }
};

export const Disabled: Story = {
  args: { direction: "right", id: "arrow-r", disabled: true },
  parameters: {
    docs: {
      description: {
        story: "Variante con la propiedad `disabled` activada, evitando que el usuario interactúe con el componente."
      }
    }
  }
};

export const Small: Story = {
  args: { size: "sm", direction: "right", id: "arrow-sm" },
  parameters: {
    docs: {
      description: {
        story: "Tamaño reducido, ideal para carruseles compactos o dispositivos móviles."
      }
    }
  }
};

export const Medium: Story = {
  args: { size: "md", direction: "right", id: "arrow-md" },
  parameters: {
    docs: {
      description: {
        story: "Tamaño equilibrado para uso general en la mayoría de interfaces de escritorio."
      }
    }
  }
};

export const Large: Story = {
  args: { size: "lg", direction: "right", id: "arrow-lg" },
  parameters: {
    docs: {
      description: {
        story: "Variante con mayor peso visual, diseñada para carruseles de ancho completo (Full Width)."
      }
    }
  }
};

export const ExtraLarge: Story = {
  args: { size: "xl", direction: "right", id: "arrow-xl" },
  parameters: {
    docs: {
      description: {
        story: "Tamaño máximo, utilizado en banners principales o galerías donde la navegación es el foco principal."
      }
    }
  }
};

export const CustomColor: Story = {
  args: {
    className: {
      base: "bg-secondary hover:bg-secondary/80",
      icon: "!border-primary/80"
    },
    id: "arrow-custom",
    direction: "right",
    size: "xl"
  },
  parameters: {
    docs: {
      description: {
        story: "Demostración de la flexibilidad de los **slots**. Aquí se modifica el fondo del contenedor y el color del borde del icono mediante clases de utilidad."
      }
    }
  }
};