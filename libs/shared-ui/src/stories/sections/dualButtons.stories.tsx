import type { Meta, StoryObj } from "@storybook/react-vite";
import { DualButtons } from "../../lib/components/dualButtons";

const description = `
El componente **DualButtons** es una sección llamativa diseñada para mostrar dos acciones principales con un diseño atractivo y profesional.

#### Características Principales:
- **Título y Descripción**: Texto centrado y destacado para captar la atención
- **Dos Botones**: Botón primario y secundario lado a lado (responsive)
- **Imagen de Fondo**: Soporte para imagen de fondo con overlay opcional
- **Overlay Configurable**: Control sobre la opacidad del fondo para mejor legibilidad
- **Responsive**: Los botones se apilan verticalmente en mobile

#### Casos de Uso:
- Secciones de llamada a la acción (CTA)
- Páginas de landing con dos opciones principales
- Secciones promocionales con múltiples acciones
- Banners informativos con botones de acción
`;

const meta = {
  component: DualButtons,
  title: "Sections/DualButtons",
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
      description: "Título principal de la sección",
      control: "object",
      table: {
        category: "Content"
      }
    },
    description: {
      description: "Descripción o subtítulo de la sección",
      control: "text",
      table: {
        category: "Content"
      }
    },
    primaryButton: {
      description: "Configuración del botón primario",
      control: "object",
      table: {
        category: "Actions"
      }
    },
    secondaryButton: {
      description: "Configuración del botón secundario",
      control: "object",
      table: {
        category: "Actions"
      }
    },
    backgroundImage: {
      description: "URL de la imagen de fondo",
      control: "text",
      table: {
        category: "Appearance"
      }
    },
    enableOverlay: {
      description: "Habilitar overlay oscuro sobre la imagen de fondo",
      control: "boolean",
      table: {
        category: "Appearance",
        defaultValue: { summary: "true" }
      }
    }
  }
} satisfies Meta<typeof DualButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: {
      text: "¿Listo para comenzar?",
      tag: "h2"
    },
    description: "Elige la opción que mejor se adapte a tus necesidades y comienza tu experiencia con nosotros hoy mismo.",
    primaryButton: {
      children: "Contratar Ahora",
      color: "primary",
      size: "lg",
      type: "button"
    },
    secondaryButton: {
      children: "Más Información",
      color: "secondary",
      size: "lg",
      type: "button"
    },
    enableOverlay: true
  }
};

export const WithBackground: Story = {
  args: {
    title: {
      text: "Únete a miles de clientes satisfechos",
      tag: "h2"
    },
    description: "Descubre por qué somos la opción preferida para servicios de telecomunicaciones en Ecuador.",
    primaryButton: {
      children: "Contratar Servicio",
      color: "whatsapp",
      size: "lg",
      type: "button"
    },
    secondaryButton: {
      children: "Ver Planes",
      color: "outline",
      size: "lg",
      type: "button"
    },
    backgroundImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
    enableOverlay: true
  }
};

export const SingleButton: Story = {
  args: {
    title: {
      text: "¿Necesitas ayuda?",
      tag: "h3"
    },
    description: "Nuestro equipo de soporte está disponible 24/7 para asistirte con cualquier consulta.",
    primaryButton: {
      children: "Contactar Soporte",
      color: "secondary",
      size: "lg",
      type: "button"
    },
    enableOverlay: true
  }
};