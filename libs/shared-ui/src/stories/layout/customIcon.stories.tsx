import type { Meta, StoryObj } from "@storybook/react-vite";
import { CustomIcon } from "../../lib/components";

const description = `
El componente \`CustomIcon\` renderiza un icono remoto proveniente del CMS y centraliza su configuración para mantener consistencia visual.

### Características principales:
- **Reutilizable:** Usa la misma interfaz en cualquier flujo que consuma iconos personalizados.
- **Accesible:** Prioriza \`imageAlt\` y usa \`name\` como respaldo para el atributo \`alt\`.
- **Control de tamaño:** Permite ajustar \`size\` para adaptarse a tarjetas, listas o bloques compactos.
- **Regla de negocio:** Los iconos con \`isActive=false\` se filtran antes del render en el mapper del frontend.

### Ejemplo de uso:
\`\`\`tsx
<CustomIcon
  name="liga-ecuabet"
  imageUrl="https://cdn.example.com/liga-ecuabet.png"
  imageAlt="Logo Liga Ecuabet"
  size={32}
/>
\`\`\`
`;

const meta = {
  component: CustomIcon,
  title: "Layout/CustomIcon",
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
    name: {
      control: "text",
      description: "Nombre de referencia del icono.",
      table: {
        category: "Data"
      }
    },
    imageUrl: {
      control: "text",
      description: "URL de la imagen del icono.",
      table: {
        category: "Data"
      }
    },
    imageAlt: {
      control: "text",
      description: "Texto alternativo del icono.",
      table: {
        category: "Accessibility"
      }
    },
    size: {
      control: "number",
      description: "Tamaño en px para width y height.",
      table: {
        category: "Display",
        defaultValue: { summary: "32" }
      }
    },
    className: {
      control: "text",
      description: "Clase CSS opcional.",
      table: {
        category: "Styles"
      }
    }
  }
} satisfies Meta<typeof CustomIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "xtrim",
    imageUrl:
      "https://statics.dathaplus.com/assets-admin-xtrim/logo_xtrim_bordes_59b864877e_a23a53b801.png",
    imageAlt: "Logo Xtrim",
    size: 40
  },
  parameters: {
    docs: {
      description: {
        story: "Render base de icono personalizado con texto alternativo."
      }
    }
  }
};

export const Small: Story = {
  args: {
    name: "xtrim-small",
    imageUrl:
      "https://statics.dathaplus.com/assets-admin-xtrim/thumbnail_logo_xtrim_bordes_59b864877e_a23a53b801.png",
    imageAlt: "Logo Xtrim miniatura",
    size: 24
  },
  parameters: {
    docs: {
      description: {
        story: "Variante compacta para usos en listas o bloques secundarios."
      }
    }
  }
};

export const AltFallback: Story = {
  args: {
    name: "paramount",
    imageUrl:
      "https://statics.dathaplus.com/assets-admin-xtrim/logo_xtrim_bordes_59b864877e_a23a53b801.png",
    size: 36
  },
  parameters: {
    docs: {
      description: {
        story:
          "Cuando no se envía imageAlt, el componente usa name como valor de alt."
      }
    }
  }
};
