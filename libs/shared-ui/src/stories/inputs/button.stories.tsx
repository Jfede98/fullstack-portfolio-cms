import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../lib/components/button";

const description = `
El componente **Button** es el elemento de interacción principal del sistema de diseño. Está diseñado para ser versátil, permitiendo su uso como un disparador de acciones estándar o como un enlace de navegación, manteniendo una estética consistente.

#### Características Principales:
- **Polimorfismo**: Cambia dinámicamente entre un tag \`<button>\` y un tag \`<a>\` (Link) simplemente cambiando la propiedad \`type\`.
- **Estados de Carga**: Incluye un slot de carga gestionado por la propiedad \`loading\`, que deshabilita la interacción y muestra un indicador visual sin alterar las dimensiones del botón.
- **Jerarquía Visual**: Soporta múltiples variantes (Primary, Secondary, Outline) para establecer una jerarquía clara de acciones en la interfaz.
- **Adaptabilidad**: Controla el ancho mediante la propiedad \`size\`, permitiendo desde anchos fijos (\`msm\`, \`sm\`) hasta anchos completos (\`full\`).

#### Guía de Uso:
1. **Acciones Primarias**: Usa la variante \`primary\` para la acción principal de la pantalla (ej. "Contratar ahora").
2. **Navegación Externa**: Configura \`type="link"\` y \`href\` para redirecciones. El componente manejará automáticamente la accesibilidad necesaria.
3. **Personalización Crítica**: Aunque el componente sigue el diseño base, puedes inyectar clases adicionales a través de \`className.base\` para casos de borde específicos.`;

const meta = {
  component: Button,
  title: "Inputs/Button",
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
    children: {
      description: "Children del Botón",
      control: "object",
      table: {
        category: "Display"
      }
    },
    color: {
      description: "Variante de color del botón",
      control: "select",
      options: ["primary", "secondary", "tertiary", "outline", "whatsapp"],
      table: {
        category: "Styles",
        defaultValue: { summary: "primary" }
      }
    },
    typeStyle: {
      description: "Estilo de forma",
      control: "radio",
      options: ["square", "rounded"],
      table: {
        category: "Styles",
        defaultValue: { summary: "square" }
      }
    },
    fontStyle: {
      description: "Estilo tipográfico",
      control: "radio",
      options: ["normal", "light"],
      table: {
        category: "Styles",
        defaultValue: { summary: "normal" }
      }
    },
    size: {
      description: "Tamaño del botón",
      control: "select",
      options: ["msm", "sm", "md", "lg", "full", "fit"],
      table: {
        category: "Display",
        defaultValue: { summary: "fit" }
      }
    },
    type: {
      description: "Tipo de botón",
      control: "select",
      options: ["button", "submit", "link"],
      table: {
        category: "Display",
        defaultValue: { summary: "button" }
      }
    },
    target: {
      description: "Tipo de redirección cuando el botón actúa como link",
      control: "select",
      options: ["_self", "_blank", "_parent", "_top"],
      if: { arg: "type", eq: "link" },
      table: {
        category: "Display",
        defaultValue: { summary: "_blank" }
      }
    },
    loading: {
      description: "Muestra el loader",
      control: "boolean",
      table: {
        category: "Display"
      }
    },
    disabledRippleEffect: {
      description: "Deshabilita el efecto de ripple",
      control: "boolean",
      table: {
        category: "Display"
      }
    },
    disabled: {
      description: "Deshabilita el botón",
      control: "boolean",
      table: {
        category: "Display"
      }
    },
    icon: {
      description: "Nombre del icono a mostrar en el botón",
      control: "text",
      table: {
        category: "Display"
      }
    },
    href: {
      description: "URL cuando el botón actúa como link",
      control: "text",
      if: { arg: "type", eq: "link" },
      table: {
        category: "Display"
      }
    },
    onClick: {
      description:
        "Evento que se dispara cuando el usuario hace clic en el botón.",
      action: "clicked",
      control: false,
      table: {
        category: "Events",
        defaultValue: {}
      }
    },
    onFocus: {
      description:
        "Evento que se dispara cuando el usuario hace clic en el botón.",
      action: "focused",
      control: false,
      table: {
        category: "Events",
        defaultValue: {}
      }
    },
    onMouseEnter: {
      description:
        "Evento que se dispara cuando el usuario hace clic en el botón.",
      action: "mouse-entered",
      control: false,
      table: {
        category: "Events",
        defaultValue: {}
      }
    },
    className: {
      control: { type: "object" },
      table: {
        category: "Styles",
        defaultValue: {}
      },
      description: "Objeto con las clases base y loading"
    }
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const argTypes = {
  onClick: { action: "clicked" },
  onMouseEnter: { action: "mouse-entered" },
  onFocus: { action: "focused" }
};

export const Default: Story = {
  args: {
    children: "Contratar ahora",
    color: "primary",
    size: "msm",
    type: "button",
    loading: false,
    disabled: false,
    disabledRippleEffect: false,
    className: { base: "", loading: "" }
  },
  argTypes,
  parameters: {
    docs: {
      description: {
        story:
          "Configuración estándar del botón utilizando la variante de color principal y tamaño mediano."
      }
    }
  }
};

export const Primary: Story = {
  args: {
    children: "Primary Button",
    color: "primary",
    size: "msm",
    type: "button",
    loading: false,
    disabled: false
  },
  argTypes,
  parameters: {
    docs: {
      description: {
        story:
          "Acción principal destacada. Se utiliza para la interacción más importante de una vista."
      }
    }
  }
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    color: "secondary",
    size: "msm",
    type: "button",
    loading: false,
    disabled: false
  },
  argTypes,
  parameters: {
    docs: {
      description: {
        story:
          "Acción secundaria. Utilizada para opciones alternativas que no deben competir visualmente con el botón primario."
      }
    }
  }
};

export const Tertiary: Story = {
  args: {
    children: "¿Necesitas ayuda?",
    color: "tertiary",
    typeStyle: "rounded",
    size: "msm",
    type: "button",
    loading: true,
    disabled: false
  },
  argTypes,
  parameters: {
    docs: {
      description: {
        story:
          "Variante de menor peso visual. En este ejemplo se muestra combinado con el estado `loading` y bordes redondeados."
      }
    }
  }
};

export const Outline: Story = {
  args: {
    children: "Solicitar por WhatsApp",
    color: "outline",
    size: "msm",
    type: "button",
    loading: false,
    disabled: false
  },
  argTypes,
  parameters: {
    docs: {
      description: {
        story:
          "Botón con borde y fondo transparente. Ideal para acciones en interfaces densas o sobre fondos de color."
      }
    }
  }
};

export const Link: Story = {
  args: {
    children: "Solicitar por WhatsApp",
    color: "outline",
    typeStyle: "rounded",
    size: "msm",
    type: "link",
    loading: false,
    disabled: false,
    target: "_blank",
    href: "https://www.google.com"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Comportamiento polimórfico: el componente renderiza una etiqueta `<a>`. Se activa automáticamente al cambiar el tipo a `link` y requiere un `href`."
      }
    }
  }
};

export const WithIcon: Story = {
  args: {
    children: "Contratar por WhatsApp",
    color: "noBorder",
    size: "fit",
    type: "link",
    icon: "WhatsappVector",
    href: "https://wa.me/1234567890",
    target: "_blank"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo de botón con icono. El icono se muestra junto al texto. Ideal para botones de acción con redes sociales o mensajería"
      }
    }
  }
};

export const WhatsApp: Story = {
  args: {
    children: "Contactar por WhatsApp",
    color: "whatsapp",
    size: "fit",
    type: "link",
    icon: "WhatsappVector",
    href: "https://wa.me/1234567890",
    target: "_blank"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Variante específica para WhatsApp con colores verdes característicos de la marca. Incluye icono y enlace directo."
      }
    }
  }
};

