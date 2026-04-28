import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon } from "../../lib/components";

const description = `
El componente **Icon** es una implementación de **Material Symbols**, optimizada para el sistema de diseño. Utiliza ligaduras de fuente para renderizar iconos vectoriales de forma eficiente y escalable.

#### Características clave:
- **Variantes de Estilo**: Permite alternar entre \`outlined\`, \`rounded\` y \`filled\` (sharp) mediante la carga de diferentes fuentes tipográficas.
- **Escalabilidad Dinámica**: Los tamaños están preconfigurados (\`msm\` a \`xxl\`) para mantener la consistencia con la rejilla de diseño.
- **Color Heredado**: Los iconos heredan el color del texto actual (\`currentColor\`), lo que facilita su integración con botones, alertas y textos.

#### Uso:
Solo necesitas pasar el nombre del icono en minúsculas (ej: \`home\`, \`search\`, \`check_circle\`) como la propiedad \`name\`.
El listado completo de iconos disponibles lo puedes encontrar en [Material Icons](https://fonts.google.com/icons?icon.set=Material+Icons)`;

const meta = {
  component: Icon,
  title: "Layout/Icon",
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
    name: {
      description: "Nombre del icono",
      control: "text",
      table: {
        category: "Display"
      }
    },
    color: {
      description: "Color del icono",
      control: "text",
      table: {
        category: "Display"
      }
    },
    size: {
      description: "Tamaño del icono",
      control: "radio",
      options: ["msm", "sm", "md", "lg", "xl", "xxl"],
      table: {
        category: "Display",
        defaultValue: { summary: "sm" }
      }
    },
    type: {
      description: "Tipo de icono",
      control: "radio",
      options: ["outlined", "rounded", "filled"],
      table: {
        category: "Styles",
        defaultValue: { summary: "outlined" }
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
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: { base: "" },
    name: "home",
    type: "rounded",
    size: "xxl",
    color: "currentColor"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Visualización base del icono. Por defecto, los iconos se renderizan con un tamaño de 24px (sm) pero pueden escalarse hasta variantes extra grandes para secciones de bienvenida o dashboards."
      }
    }
  }
};

export const Outlined: Story = {
  args: {
    name: "settings",
    type: "outlined",
    size: "lg"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Estilo con trazos lineales delgados. Es la variante más ligera visualmente, recomendada para interfaces densas o barras de navegación secundarias."
      }
    }
  }
};

export const Rounded: Story = {
  args: {
    name: "account_circle",
    type: "rounded",
    size: "lg"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Variante con terminaciones suaves y circulares. Proporciona una estética amigable y moderna, ideal para elementos de perfil o acciones de usuario."
      }
    }
  }
};

export const Filled: Story = {
  args: {
    name: "verified",
    type: "filled",
    size: "lg"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Versión con relleno sólido. Se utiliza para indicar estados activos, selecciones marcadas o para dar un peso visual fuerte a un elemento específico."
      }
    }
  }
};

export const Sizes: Story = {
  args: {
    name: "favorite",
    type: "rounded",
    size: "xxl"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demostración de la escala de tamaños. Desde el `msm` (micro) hasta el `xxl` (display), asegurando que el grosor del trazo se mantenga legible."
      }
    }
  }
};

export const CustomColor: Story = {
  args: {
    name: "fingerprint",
    type: "rounded",
    size: "xxl",
    color: "text-primary"
  },
  parameters: {
    docs: {
      description: {
        story: "Los iconos heredan las propiedades de color del sistema de diseño. Esta historia demuestra cómo aplicar clases de utilidad de color (ej. `text-primary`, `text-green`) para alinear el icono con el contexto de la interfaz.",
      }
    }
  }
};
