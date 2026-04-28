import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion } from "../../lib/components";

const description = `
El componente **Accordion** organiza el contenido en secciones plegables independientes, optimizando el espacio vertical de la interfaz. Es ideal para secciones de ayuda, preguntas frecuentes o menús de navegación complejos.

#### Características Principales:
- **Soporte Markdown Nativo**: La propiedad \`description\` de cada item acepta **texto en formato Markdown**. Esto permite incluir negritas, listas, enlaces e incluso bloques de código de forma directa.
- **Modo Exclusivo (\`isExclusive\`)**: Permite alternar entre un comportamiento de apertura única (se cierra el anterior al abrir uno nuevo) o apertura múltiple.
- **Polimorfismo Visual**: Adaptable a diferentes contextos mediante la propiedad \`variant\` (ej. \`footer\` para menús institucionales o \`faq\` para centros de ayuda).

#### Ejemplo de uso en Items:
\`\`\`javascript
{
  title: "Términos y Condiciones",
  description: "Acepta nuestros [términos](https://...) para continuar."
}
\`\`\`
`;

const meta = {
  component: Accordion,
  title: "Layout/Accordion",
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
    title: { table: { disable: true } },
    linkProps: { table: { disable: true } },
    description: { table: { disable: true } },
    items: {
      description: "Lista de secciones del acordeón.",
      control: "object",
      table: {
        category: "Content",
        type: {
          summary: "Array<{ title: string, description: string }>",
          detail:
            "title: El texto del encabezado.\ndescription: Contenido enriquecido con soporte para Markdown (enlaces, listas, negritas)."
        }
      }
    },
    variant: {
      description: "Define el estilo visual preconfigurado del acordeón.",
      control: "select",
      options: ["footer", "faq"],
      table: {
        category: "Styles",
        defaultValue: { summary: "footer" }
      }
    },
    isExclusive: {
      description:
        "Si es verdadero, solo permite mantener un item abierto a la vez. Si es falso, permite apertura múltiple.",
      control: "boolean",
      table: {
        category: "Logic",
        defaultValue: { summary: "true" }
      }
    },
    className: {
      description:
        "Objeto para inyectar clases personalizadas en los slots del componente.",
      control: "object",
      table: {
        category: "Styles",
        defaultValue: { summary: "{ base: '', dropdown: {base: '',trigger: '',title: '',desc: ''} }" }
      }
    }
  }
} satisfies Meta<unknown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: {
      base: "",
      dropdown: {
        base: "",
        trigger: "",
        title: "",
        desc: ""
      }
    },
    variant: "default",
    isExclusive: true,
    items: [
      {
        title:
          "¿Qué hago si no tengo servicio de internet y mi equipo muestra luces intermitentes?",
        description:
          "Si tienes problemas con tu servicio de internet y tu módem muestra luces intermitentes, sigue estos pasos..."
      },
      {
        title:
          "¿Qué hago si no tengo servicio de internet y mi equipo muestra luces intermitentes?",
        description:
          "Si tienes problemas con tu servicio de internet y tu módem muestra luces intermitentes, sigue estos pasos..."
      },
      {
        title:
          "¿Qué hago si no tengo servicio de internet y mi equipo muestra luces intermitentes?",
        description:
          "Si tienes problemas con tu servicio de internet y tu módem muestra luces intermitentes, sigue estos pasos..."
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story:
          "Variante optimizada para el **pie de página**. Presenta un diseño más sobrio y compacto, ideal para organizar enlaces de navegación institucional."
      }
    }
  }
};

export const Outline: Story = {
  args: {
    className: {
      base: "",
      dropdown: {
        base: "",
        trigger: "",
        title: "",
        desc: ""
      }
    },
    variant: "outline",
    isExclusive: true,
    items: [
      {
        title:
          "¿Qué hago si no tengo servicio de internet y mi equipo muestra luces intermitentes?",
        description:
          "Si tienes problemas con tu servicio de internet y tu módem muestra luces intermitentes, sigue estos pasos..."
      },
      {
        title:
          "¿Qué hago si no tengo servicio de internet y mi equipo muestra luces intermitentes?",
        description:
          "Si tienes problemas con tu servicio de internet y tu módem muestra luces intermitentes, sigue estos pasos..."
      },
      {
        title:
          "¿Qué hago si no tengo servicio de internet y mi equipo muestra luces intermitentes?",
        description:
          "Si tienes problemas con tu servicio de internet y tu módem muestra luces intermitentes, sigue estos pasos..."
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story:
          "Variante **Outline**. Diseñada con un peso visual mayor para destacar los títulos y mejorar la legibilidad en centros de ayuda."
      }
    }
  }
};

const descriptionLinks = `
- [Google](https://www.google.com)
- [YouTube](https://www.youtube.com)
- [Wikipedia](https://www.wikipedia.org)
- [Twitter](https://www.twitter.com)
- [GitHub](https://www.github.com)
- [Amazon](https://www.amazon.com)
- [Instagram](https://www.instagram.com)
- [Reddit](https://www.reddit.com)
- [LinkedIn](https://www.linkedin.com)
- [Netflix](https://www.netflix.com)`;

export const Links: Story = {
  args: {
    className: {
      base: ""
    },
    isExclusive: true,
    linkProps: {
      className: {
        base: "text-gray-300"
      }
    },
    items: [
      {
        title: "Enlaces",
        description: descriptionLinks
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story:
          "Muestra la capacidad del componente para renderizar **contenido enriquecido**. En este caso, una lista de enlaces externos procesada mediante Markdown dentro del panel desplegable."
      }
    }
  }
};
