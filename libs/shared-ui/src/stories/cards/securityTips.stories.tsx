import type { Meta, StoryObj } from "@storybook/react-vite";
import { SecurityTipsCard } from "../../lib/components";

const description = `Componente listo para usar que encapsula el layout de "Consejos de seguridad".

- Incluye icono, título, descripción y CTA opcional.
- Hereda el estilo base de Card y respeta tokens de tipografía/iconografía.
- Permite personalizar textos, íconos y clases por slot (contenedor, título, descripción, enlace).
- Si no se pasa \`href\`, no se muestra el enlace.`;

const meta = {
  component: SecurityTipsCard,
  title: "Cards/SecurityTipsCard",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: description
      }
    }
  },
  argTypes: {
    title: {
      control: "text",
      description: "Título principal de la tarjeta"
    },
    description: {
      control: "text",
      description: "Descripción breve de la tarjeta"
    },
    linkText: {
      control: "text",
      description: "Texto del enlace de acción"
    },
    href: {
      control: "text",
      description: "URL a la que apunta el enlace"
    },
    className: {
      control: "object",
      description:
        "Permite personalizar los estilos de contenedor, título, descripción o enlace",
      table: {
        type: {
          summary: "{ container?: string; title?: string; description?: string; link?: string; }"
        }
      }
    }
  }
} satisfies Meta<typeof SecurityTipsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Consejos de seguridad",
    description:
      "Te compartimos consejos importantes acerca de la seguridad en redes y servicios",
    linkText: "Saber más",
    href: "https://www.google.com"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Versión base del componente con el diseño por defecto de los tokens de seguridad."
      }
    }
  }
};

export const WithCustomStyles: Story = {
  args: {
    title: "Mantén tu red segura",
    description:
      "Actualiza tus contraseñas y evita compartir accesos en redes públicas.",
    linkText: "Ver recomendaciones",
    href: "https://www.google.com",
    className: {
      container: [
        "bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900",
        "text-left",
        "items-start",
        "text-white",
        "border-indigo-500/40",
        "shadow-2xl",
        "shadow-indigo-500/30"
      ].join(" "),
      title: "text-white",
      description: "text-slate-200",
      link:
        "text-amber-300 hover:text-amber-200 underline underline-offset-4 decoration-amber-300"
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo de personalización completa: fondo oscuro con gradiente, alineación a la izquierda y CTA en ámbar para mostrar la flexibilidad de estilos."
      }
    }
  }
};
