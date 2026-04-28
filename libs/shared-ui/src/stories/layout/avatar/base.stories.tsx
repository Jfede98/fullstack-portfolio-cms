import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../../../lib/components";
import Img1 from "../../../assets/img/banner1.webp";


const description = `
El componente **Avatar** se utiliza para representar visualmente a usuarios, entidades o avatares de perfil. 

#### Características:
- **Escalabilidad**: Soporta múltiples tamaños predefinidos (\`sm\`, \`md\`, \`lg\`, \`xl\`).
- **Enfoque en Estilo**: Opción de borde configurable para mejorar el contraste sobre diferentes fondos.
- **Robustez**: Diseñado para mantener una relación de aspecto circular perfecta independientemente de la fuente de la imagen.
`;

const meta = {
  component: Avatar,
  title: "Layout/Avatar/Base",
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
    src: {
      description: "URL de la imagen o asset importado.",
      control: "text",
      table: { category: "Content" }
    },
    size: {
      description: "Dimensiones del avatar.",
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      table: {
        category: "Styles",
        defaultValue: { summary: "lg" }
      }
    },
    border: {
      description: "Añade un borde decorativo alrededor del avatar.",
      control: "boolean",
      table: {
        category: "Styles",
        defaultValue: { summary: "false" }
      }
    },
    className: {
      control: "object",
      description: "Objeto para personalizar las clases del componente (slot: base).",
      table: {
        category: "Styles"
      }
    }
  }
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: Img1 as unknown as string,
    size: "xl",
    border: true,
    className: {
      base: ""
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Muestra el avatar en su tamaño más grande con un borde habilitado."
      }
    }
  }
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-4">
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
      <Avatar {...args} size="xl" />
    </div>
  ),
  args: {
    src: Img1 as unknown as string,
    border: false
  },
  parameters: {
    docs: {
      description: {
        story: "Comparativa de los diferentes tamaños disponibles: Small (sm), Medium (md), Large (lg) y Extra Large (xl)."
      }
    }
  }
};

export const Bordered: Story = {
  args: {
    src: Img1 as unknown as string,
    size: "lg",
    border: true,
    className: {
      base: "border-primary shadow-lg"
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Ejemplo del avatar con borde activo y clases personalizadas para aplicar un color de marca y sombra."
      }
    }
  }
};