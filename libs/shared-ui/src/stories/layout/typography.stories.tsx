import type { Meta, StoryObj } from "@storybook/react-vite";
import { Typography } from "../../lib/components";

const description = `
El componente \`Typography\` es el núcleo del sistema de diseño para el manejo de textos. Utiliza un sistema de **tipado estricto** que restringe el uso de propiedades específicas según la variante seleccionada.

### Características principales:
- **Variantes Flexibles:** Soporta desde jerarquías de títulos (\`h1\`-\`h3\`) hasta montos monetarios (\`ammount\`).
- **Restricción de Props:** La propiedad \`small\` **solo es válida** cuando se utilizan las variantes \`hero\` o \`legal\`. En cualquier otra variante, el compilador de TypeScript marcará un error.
- **Polimorfismo:** Permite cambiar la etiqueta HTML subyacente (\`tag\`) sin afectar el estilo visual.

### Ejemplo de uso:
\`\`\`tsx
// Uso correcto de variante con tamaño reducido
<Typography variant="hero" small>Texto Hero Pequeño</Typography>

// TypeScript impedirá el uso de 'small' aquí:
<Typography variant="body" small /> // 
\`\`\`
`;

const meta = {
  component: Typography,
  title: "Layout/Typography",
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
    variant: {
      description: "Variante de tipografía",
      control: "select",
      options: [
        "hero",
        "h1",
        "h2",
        "h3",
        "title",
        "subtitle",
        "body",
        "caption",
        "legal",
        "ammount1",
        "ammount2",
        "ammount3"
      ],
      table: {
        category: "Display",
        defaultValue: { summary: "body" }
      }
    },
    children: {
      description: "Texto del componente",
      control: "text",
      table: {
        category: "Display"
      }
    },
    tag: {
      description: "Etiqueta HTML",
      control: "select",
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "span",
        "strong",
        "b",
        "em",
        "sub",
        "sup",
        "pre"
      ],
      table: {
        category: "Specification",
        defaultValue: { summary: "span" }
      }
    },
    type: {
      description: "Tipo de tipografía",
      control: "radio",
      options: ["light", "regular", "bold"],
      table: {
        category: "Display",
        defaultValue: { summary: "regular" }
      }
    },
    underline: {
      description: "Texto subrayado",
      control: "boolean",
      table: {
        category: "Display",
        defaultValue: { summary: "false" }
      }
    },
    small: {
      description:
        "Tamaño del texto pequeño, unicamente disponible para variantes hero y legal",
      control: "boolean",
      table: {
        category: "Display",
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
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: { base: "" },
    variant: "hero",
    type: "light",
    underline: false,
    small: false,
    tag: "span",
    children: "Typography"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Vista general del componente con la variante Hero predeterminada."
      }
    }
  }
};

export const Hero: Story = {
  args: {
    className: { base: "" },
    variant: "hero",
    type: "regular",
    small: false,
    children: "Typography"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Título de máximo impacto para encabezados de páginas principales y secciones destacadas."
      }
    }
  }
};

export const HeroSmall: Story = {
  args: {
    className: { base: "" },
    variant: "hero",
    type: "regular",
    small: true,
    children: "Typography"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Versión compacta de la variante Hero, diseñada para dispositivos móviles o banners secundarios."
      }
    }
  }
};

export const Ammount1: Story = {
  args: {
    className: { base: "" },
    variant: "ammount1",
    type: "regular",
    children: "Typography"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Estilo para montos monetarios principales. Utiliza el peso visual más alto para saldos totales."
      }
    }
  }
};

export const Ammount2: Story = {
  args: {
    className: { base: "" },
    variant: "ammount2",
    type: "regular",
    children: "Typography"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Monto de jerarquía secundaria, ideal para subtotales o resúmenes financieros."
      }
    }
  }
};

export const Ammount3: Story = {
  args: {
    className: { base: "" },
    variant: "ammount3",
    type: "regular",
    children: "Typography"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Monto de apoyo para listas de transacciones o detalles minuciosos dentro de tarjetas."
      }
    }
  }
};

export const HeadingH1: Story = {
  args: {
    className: { base: "" },
    variant: "h1",
    type: "regular",
    children: "Typography"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Título de primer nivel (H1). Define el tema principal de la vista actual."
      }
    }
  }
};

export const HeadingH2: Story = {
  args: {
    className: { base: "" },
    variant: "h2",
    type: "regular",
    children: "Typography"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Título de segundo nivel (H2). Utilizado para separar secciones grandes dentro de una página."
      }
    }
  }
};

export const HeadingH3: Story = {
  args: {
    className: { base: "" },
    variant: "h3",
    type: "regular",
    children: "Typography"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Título de tercer nivel (H3). Agrupador de contenido específico dentro de módulos o secciones."
      }
    }
  }
};

export const Title: Story = {
  args: {
    className: { base: "" },
    variant: "title",
    type: "regular",
    children: "Typography"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Variante para títulos de componentes medianos como modales o encabezados de tarjetas."
      }
    }
  }
};

export const Subtitle: Story = {
  args: {
    className: { base: "" },
    variant: "subtitle",
    type: "regular",
    children: "Typography"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Texto de apoyo para títulos o encabezados descriptivos de menor peso visual."
      }
    }
  }
};

export const Body: Story = {
  args: {
    className: { base: "" },
    variant: "body",
    type: "regular",
    children: "Typography"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Estilo base para bloques de texto, párrafos y lectura fluida de información general."
      }
    }
  }
};

export const Caption: Story = {
  args: {
    className: { base: "" },
    variant: "caption",
    type: "regular",
    children: "Typography"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Texto de apoyo para micro-copy, leyendas de imágenes o etiquetas de formularios."
      }
    }
  }
};

export const Legal: Story = {
  args: {
    className: { base: "" },
    variant: "legal",
    type: "regular",
    small: false,
    children: "Typography"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Variante para descargos de responsabilidad y términos legales. Soporta el tamaño reducido (small)."
      }
    }
  }
};

export const LegalSmall: Story = {
  args: {
    className: { base: "" },
    variant: "legal",
    type: "regular",
    small: true,
    children: "Typography"
  },
  parameters: {
    docs: {
      description: {
        story:
          "La versión más pequeña del sistema (10px). Exclusiva para notas legales extensas o pies de página técnicos."
      }
    }
  }
};
