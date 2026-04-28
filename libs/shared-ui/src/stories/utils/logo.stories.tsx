import type { Meta, StoryObj } from "@storybook/react-vite";
import { Logo } from "../../lib/components";

const description = `
El componente **Logo** es una implementación vectorial (SVG) que permite un control granular sobre su apariencia visual. 

### Capacidades:
- **Control de Dimensiones**: Ajuste directo de \`width\` y \`height\`.
- **Inyección de Color por Path**: Permite definir colores específicos para las partes \`primary\` y \`secondary\` del isotipo/logotipo.
- **Personalización CSS**: Soporta clases de Tailwind o CSS puro para manipular las propiedades \`fill\` y \`stroke\` globales del SVG.
`;

const meta = {
  component: Logo,
  title: "Utilities/Logo",
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
    width: {
      control: "text",
      description: "Ancho del logo (ej: '150px', '100%').",
      table: { category: "Dimensions", defaultValue: { summary: "120px" } }
    },
    height: {
      control: "text",
      description: "Alto del logo.",
      table: { category: "Dimensions" }
    },
    pathColors: {
      control: "object",
      description: "Colores específicos para las diferentes partes del trazado SVG.",
      table: { category: "Colors" }
    },
    className: {
      control: "object",
      description: "Objeto con clases de CSS/Tailwind para 'fill' y 'stroke'.",
      table: { category: "Styles" }
    }
  }
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    pathColors: {
      primary: "#783484",
      secondary: "#00B5E2"
    }
  },
  parameters: {
    docs: {
      story: "Versión estándar del logo con los colores institucionales."
    }
  }
};

export const Monochrome: Story = {
  args: {
    className: {
      fill: "fill-gray-500"
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Ejemplo de uso monocromático, ideal para footers o secciones secundarias mediante el uso de clases CSS."
      }
    }
  }
};

export const CustomColors: Story = {
  args: {
    pathColors: {
      primary: "#000000",
      secondary: "#FF5733"
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Personalización total de los senderos (paths) del SVG para campañas específicas."
      }
    }
  }
};


export const Size: Story = {
  args: {
    width: "650",
    height: "100",
  },
  parameters: {
    docs: {
      description: {
        story: "Personalización de tamaño para el logotipo."
      }
    }
  }
};
