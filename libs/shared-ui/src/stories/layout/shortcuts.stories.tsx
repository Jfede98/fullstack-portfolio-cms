import type { Meta, StoryObj } from "@storybook/react-vite";
import { Shortcuts } from "../../lib/components";
import type { IShortcutItem } from "../../lib/interfaces";

const description = `El componente **Shortcuts** proporciona una lista de accesos rápidos con iconos y enlaces, ideal para facilitar la navegación a secciones o servicios importantes.

#### Características clave:
- **Flexible**: Recibe un array de items como prop para personalizar los accesos directos
- **Iconos personalizables**: Utiliza iconos de Material Design con props \`iconProps\` y \`arrowIconProps\` para personalizar color y tipo
- **Estilos customizables**: Acepta \`className\` como objeto para personalizar cada parte del componente con clsx
- **Navegación**: Cada item es un enlace clicable con transición suave
- **Responsive**: Se adapta automáticamente a diferentes tamaños de pantalla
- **Hover effects**: Incluye efectos visuales al pasar el mouse sobre cada item`;

const shortcutsData: IShortcutItem[] = [
  {
    title: "Canales de pago",
    icon: "credit_card",
    href: "#"
  },
  {
    title: "Centros de experiencia",
    icon: "pin_drop",
    href: "#"
  },
  {
    title: "Centro de ayuda",
    icon: "help",
    href: "#"
  },
  {
    title: "Soporte técnico",
    icon: "support_agent",
    href: "#"
  }
];

const meta = {
  component: Shortcuts,
  title: "Layout/Shortcuts",
  tags: ["autodocs"],
  excludeStories: /Data$/,
  argTypes: {
    items: {
      control: "object",
      description: "Array de objetos con los datos de cada shortcut (title, icon, href)",
      table: {
        category: "Data",
        type: {
          summary: "IShortcutItem[]",
          detail: "{ title: string; icon: string; href: string; }[]"
        }
      }
    },
    className: {
      control: "object",
      description: "Objeto con clases CSS para personalizar cada parte del componente usando clsx",
      table: {
        category: "Styles",
        type: {
          summary: "IShortcutsClassName",
          detail: "{ base?: string; itemContainer?: string; link?: string; icon?: string; text?: string; arrow?: string; }"
        }
      }
    },
    iconProps: {
      control: "object",
      description: "Props para personalizar los iconos principales (color, type, size)",
      table: {
        category: "Icon Customization",
        type: {
          summary: "IIconStyleProps",
          detail: "{ color?: string; type?: 'outlined' | 'rounded' | 'sharp'; size?: 'msm' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'; }"
        },
        defaultValue: { summary: "{ color: 'text-primary', type: 'rounded', size: 'md' }" }
      }
    },
    arrowIconProps: {
      control: "object",
      description: "Props para personalizar el icono de flecha (color, type, size)",
      table: {
        category: "Icon Customization",
        type: {
          summary: "IIconStyleProps"
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
} satisfies Meta<typeof Shortcuts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: shortcutsData
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo básico de **Shortcuts** con 4 items. Cada item incluye un título, un icono y un enlace. Los iconos usan el estilo por defecto: `color: 'text-primary'`, `type: 'rounded'` y `size: 'md'`."
      }
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#000000" }
      ]
    }
  }
};

export const ThreeItems: Story = {
  args: {
    items: shortcutsData.slice(0, 3)
  },
  parameters: {
    docs: {
      description: {
        story: "Variante con solo **3 items**, ideal para espacios más reducidos o cuando se necesitan menos opciones."
      }
    }
  }
};

export const CustomIcons: Story = {
  args: {
    items: [
      {
        title: "Seguridad",
        icon: "shield",
        href: "#"
      },
      {
        title: "Notificaciones",
        icon: "notifications",
        href: "#"
      },
      {
        title: "Configuración",
        icon: "settings",
        href: "#"
      },
      {
        title: "Documentación",
        icon: "description",
        href: "#"
      }
    ],
    iconProps: {
      color: "text-secondary",
      type: "outlined",
      size: "lg"
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Ejemplo con **iconos personalizados** usando `iconProps` para cambiar el color a `text-secondary`, tipo a `outlined` y tamaño a `lg`."
      }
    }
  }
};

export const WithCustomClassName: Story = {
  args: {
    items: shortcutsData.slice(0, 3),
    className: {
      base: "bg-gray-50 border-2 border-primary-200",
      itemContainer: "border-primary-100",
      link: "hover:bg-primary-50 px-2 py-1 rounded",
      text: "text-gray-800 font-bold",
      icon: "text-secondary"
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Ejemplo usando **className** personalizado para modificar los estilos. Se personaliza el fondo del contenedor, bordes, hover del link, y estilos del texto e iconos."
      }
    }
  }
};

export const WithCustomArrowIcon: Story = {
  args: {
    items: shortcutsData,
    iconProps: {
      color: "text-primary",
      type: "rounded",
      size: "md"
    },
    arrowIconProps: {
      color: "text-gray-400",
      type: "outlined",
      size: "sm"
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Ejemplo con **iconos de flecha personalizados** usando `arrowIconProps`. Los iconos principales mantienen el estilo primario mientras las flechas usan un color gris más sutil."
      }
    }
  }
};

export { shortcutsData };



