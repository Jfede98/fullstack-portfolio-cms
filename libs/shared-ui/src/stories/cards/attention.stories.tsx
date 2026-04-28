import type { Meta, StoryObj } from "@storybook/react-vite";
import { AttentionCard } from "../../lib/components/cards/attention";

const description = `El componente **AttentionCard** se utiliza para captar la atención del usuario mediante una tarjeta que resalta información importante o llamativa.

#### Características clave:
- **Diseño Atractivo**: Presenta un diseño llamativo que destaca sobre otros elementos de la interfaz.
- **Responsive**: En mobile (hasta md) muestra un botón, en desktop (md en adelante) muestra solo el texto.
- **Contenido Personalizable**: Permite customizar el icono, título, texto y botón.
- **Composición con Card**: Utiliza el componente base \`Card\` internamente, heredando sus estilos fundamentales.`;

const meta = {
  component: AttentionCard,
  title: "Cards/AttentionCard",
  tags: ["autodocs"],
  excludeStories: /Data$/,
  argTypes: {
    iconName: {
      table: {
        category: "Content",
        type: { summary: "string" }
      },
      control: "text",
      description:
        "Nombre del icono a mostrar. Se usa con el componente `Icon` internamente."
    },
    title: {
      table: {
        category: "Content",
        type: { summary: "string" }
      },
      control: "text",
      description:
        "Título de la tarjeta. Texto principal que se muestra destacado."
    },
    text: {
      table: {
        category: "Content (Desktop)",
        type: { summary: "string" }
      },
      control: "text",
      description:
        "Texto principal visible **solo en desktop (md+)**. En mobile se oculta y aparece el botón."
    },
    button: {
      table: {
        category: "Content (Mobile)",
        type: { summary: "string" }
      },
      control: "text",
      description:
        "Texto del botón visible **solo en mobile (hasta md)**. En desktop se oculta y aparece el texto."
    },
    icon: {
      control: "object",
      description:
        "Objeto con propiedades de estilo del icono (type, size, color). Permite personalizar la apariencia del icono sin cambiar el nombre. Hereda las variantes de IconStyle.",
      table: {
        category: "Icon",
        type: {
          summary: "IIconStyleProps",
          detail:
            "{ type?: 'outlined' | 'rounded' | 'filled', size?: 'msm' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', color?: string }"
        },
        defaultValue: {
          summary: "{ type: 'outlined', size: 'sm' }"
        }
      }
    },
    className: {
      control: "object",
      description:
        "Objeto con clases CSS para personalizar diferentes partes del componente.",
      table: {
        category: "Styles",
        type: {
          summary: "IAttentionCardClassName",
          detail:
            "{ container?: string, title?: string, text?: string, button?: string }"
        }
      }
    }
  },
  parameters: {
    docs: {
      description: {
        component: description
      }
    }
  }
} satisfies Meta<typeof AttentionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    iconName: "phone",
    title: "Call Center",
    text: "02 600 400",
    button: { children: "Llamar Ahora" }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Configuración estándar de la tarjeta de atención con información de contacto telefónico."
      }
    }
  }
};

export const SocialNetworks: Story = {
  args: {
    iconName: "people",
    title: "Redes Sociales",
    text: "@xtrimecuador",
    button: { children: "Contactar" }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Tarjeta de atención configurada para mostrar información de redes sociales."
      }
    }
  }
};

export const Whatsapp: Story = {
  args: {
    iconName: "phone",
    title: "Whatsapp",
    text: "096 8600 400",
    button: { children: "Iniciar conversación" }
  },
  parameters: {
    docs: {
      description: {
        story: "Tarjeta de atención para contacto vía Whatsapp."
      }
    }
  }
};

export const WithCustomIcon: Story = {
  args: {
    iconName: "email",
    title: "Correo Electrónico",
    text: "contacto@xtrim.com",
    button: { children: "Enviar Email" },
    icon: {
      type: "filled",
      size: "lg",
      color: "text-secondary-500"
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo con icono personalizado usando `icon`. Permite cambiar el tipo (filled), tamaño (lg) y color (secondary-500) del icono."
      }
    }
  }
};

export const WithCustomStyles: Story = {
  args: {
    iconName: "support_agent",
    title: "Soporte Técnico",
    text: "Estamos disponibles",
    button: { children: "Contactar" },
    icon: {
      type: "outlined",
      size: "xl",
      color: "text-primary-600"
    },
    className: {
      container: "bg-primary-50 border-primary-200",
      title: "text-primary-600 font-bold",
      text: "text-primary-500",
      button: "mt-4"
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo completo con icono y estilos personalizados. Combina `icon` para personalizar el icono y `className` para los estilos del contenedor."
      }
    }
  }
};
