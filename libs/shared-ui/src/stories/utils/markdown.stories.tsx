import type { Meta, StoryObj } from "@storybook/react-vite";
import { MarkdownItem } from "../../lib/components";

const description = `
El componente **MarkdownItem** actúa como un transformador de contenido. Utiliza \`react-markdown\` para convertir texto plano con sintaxis Markdown en componentes de React estilizados según el sistema de diseño.

#### Características principales:
- **Mapeo de Componentes**: Convierte automáticamente etiquetas \`<a>\` en tu componente custom \`Link\`, aplicando lógica de seguridad (\`rel="noopener"\`) para enlaces externos.
- **Estilos Consistentes**: Aplica clases de Tailwind predefinidas a párrafos (\`p\`), listas (\`ul\`) y elementos de lista (\`li\`).
- **Lógica de Enlaces**: Detecta automáticamente si un enlace es externo (si empieza por \`http\`) para aplicar \`target="_blank"\` por defecto, a menos que se especifique lo contrario en \`linkProps\`.

**NOTA:** LinkProps solo afecta paara componentes link que usen 
`;

const meta = {
  component: MarkdownItem,
  title: "Utilities/Markdown",
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
    desc: {
      description: "Contenido en formato Markdown a renderizar.",
      control: "text",
      table: { category: "Content" }
    },
    className: {
      description:
        "Objeto para personalizar clases de los slots: paragraph, list, listItem, link.",
      control: "object",
      table: { category: "Styles" }
    },
    linkProps: {
      description:
        "Propiedades adicionales que se pasarán a todos los componentes Link renderizados.",
      control: "object",
      table: { category: "Link Configuration" }
    }
  }
} satisfies Meta<typeof MarkdownItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    desc: `Este es un **párrafo estándar** que demuestra el soporte de Markdown.
- Los enlaces como [Google](https://google.com) se renderizan usando el componente \`Link\`.
- Soporta formato de **negrita** e *itálica*.`,
    className: {
      paragraph: "!text-primary",
      listItem: "text-gray-400",
      list: "list-disc pl-5",
      link: "text-primary"
    },
    linkProps: {
      prefetch: true,
      target: "_self",
      rel: "noopener"
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Muestra la transformación básica de texto a elementos de UI estilizados."
      }
    }
  }
};

export const ComplexLinks: Story = {
  args: {
    desc: `Enlaces internos y externos:
- Externo: [Ir a GitHub](https://github.com) (Se abre en pestaña nueva por defecto).
- Interno: [Ir a Inicio](/?path=/docs/utilities-markdown--docs) (Mantiene la navegación en la misma pestaña).`,
    linkProps: {
      className: { base: "underline font-bold" }
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demuestra cómo las `linkProps` afectan a todos los enlaces dentro del contenido Markdown."
      }
    }
  }
};

export const CustomListStyle: Story = {
  args: {
    desc: `- Elemento uno\n- Elemento dos\n- Elemento tres`,
    className: {
      list: "space-y-4 list-decimal pl-5",
      listItem: "text-blue-600 italic"
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Personalización de estilos específicos para listas y elementos de lista a través del prop `className`."
      }
    }
  }
};
