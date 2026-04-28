import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "../../lib/components";

const description = `
El componente **Link** es un envoltorio flexible para crear enlaces en tus aplicaciones. Puedes usarlo con Next.js o cualquier otro tipo de enlace, con soporte para propiedades como:

- **href**: El destino del enlace.
- **target**: Cómo se abrirá el enlace (ejemplo: '_blank' para abrir en una nueva pestaña).
- **prefetch**: Activa o desactiva el prefetching para mejorar el rendimiento.
- **className**: Personaliza los estilos del enlace.
- **component**: Componente persolizado, en caso de necesitar enlaces de NextJS, por favor especificarlo aquí.

### Ejemplo de uso:

\`\`\`tsx
<Link href="https://www.google.com" target="_blank">Visita Google</Link>
\`\`\`

**Con NextJS**
\`\`\`tsx
import NextLink from "next/link";

<Link href="https://www.google.com" target="_blank"  component={NextLink}>Visita Google</Link>
\`\`\`
`;

const meta = {
  component: Link,
  title: "Utilities/Link",
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
    replace: { table: { disable: true } },
    scroll: { table: { disable: true } },
    shallow: { table: { disable: true } },
    locale: { table: { disable: true } },
    rel: { table: { disable: true } },
    href: {
      control: "text",
      description: "El destino del enlace.",
      defaultValue: "",
      table: {
        category: "Specification"
      }
    },
    as: {
      control: "text",
      description:
        "Decorador opcional para la ruta que se mostrará en la barra de URL del navegador. Antes de Next.js 9.5.3, esto se usaba para rutas dinámicas. **Disponible unicamente para NextJS. **",
      defaultValue: "",
      table: {
        category: "Specification"
      }
    },
    target: {
      control: {
        type: "radio",
        options: ["_blank", "_self", "_parent", "_top"]
      },
      description: "Especifica cómo se abrirá el enlace.",
      table: {
        category: "Specification",
        defaultValue: { summary: "_blank" }
      }
    },
    prefetch: {
      control: "boolean",
      description: "Controla si el enlace debe ser prefetchado por Next.js. **Disponible unicamente para NextJS. **",
      defaultValue: true,
      table: {
        category: "Specification",
        defaultValue: { summary: "_blank" }
      }
    },
    component: {
      control: {
        type: "select",
        options: ["a", "Link"]
      },
      description:
        "El componente que se renderizará dentro del enlace. Por defecto usa el componente ancla, pero si se requiere usar un componente en particular de enlace como el que usa Next, aquí es donde debes especificarlo.",
      table: {
        category: "Specification",
        defaultValue: { summary: "a" }
      }
    },
    children: {
      control: "object",
      description: "El contenido del enlace.",
      table: {
        category: "Display"
      }
    },
    className: {
      control: "object",
      description: "Clases CSS personalizadas para el enlace.",
      table: {
        category: "Styles",
        defaultValue: { summary: "_blank" }
      }
    },
    onNavigate: {
      description:
        "Un controlador de eventos llamado durante la navegación del lado del cliente. El controlador recibe un objeto de evento que incluye un preventDefault() método que le permite cancelar la navegación si es necesario. **Disponible unicamente para NextJS. **",
      action: "clicked",
      control: false,
      table: {
        category: "Events"
      }
    }
  }
} satisfies Meta<unknown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <span>Link</span>,
    href: "https://www.google.com",
    target: "_blank",
    className: {
      base: ""
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Vista general del componente."
      }
    }
  }
};
