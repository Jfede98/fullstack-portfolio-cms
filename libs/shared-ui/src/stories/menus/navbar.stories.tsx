import type { Meta, StoryObj } from "@storybook/react-vite";
import { Navbar } from "../../lib/components";

const description = `
La **Navbar** es el componente principal de navegación superior. Está diseñada como un contenedor flotante con múltiples niveles de interacción y soporte para contenido dinámico.

### Características Principales:
- **Diseño Híbrido**: Soporta una barra superior (\`navbarTop\`) para segmentación de audiencias (ej. Hogar/Empresas) y una barra principal para navegación profunda.
- **Dropdowns Dinámicos**: En desktop, los menús se despliegan al hacer hover, centrados respecto al ítem padre.
- **Soporte de Children**: Permite inyectar cualquier \`ReactNode\` dentro de los dropdowns, ideal para banners promocionales o formularios.
- **Responsive**: Transición automática a menú hamburguesa y Sidebar flotante en dispositivos móviles.
- **Sticky y Glassmorphism**: Implementa un efecto de desenfoque de fondo y posicionamiento fijo para mejorar la experiencia de usuario al hacer scroll.
`;

const meta: Meta<typeof Navbar> = {
  component: Navbar,
  title: "Menu/Navbar",
  tags: ["autodocs"],
  excludeStories: /Data$/,
  decorators: [
    (Story) => (
      <div className="min-h-45 bg-gray-50">
        <Story />
      </div>
    )
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: description
      }
    }
  },
  argTypes: {
    links: {
      description:
        "Array de objetos que definen la navegación principal, incluyendo sub-enlaces o contenido personalizado.",
      control: "object",
      table: { category: "Navigation" }
    },
    navbarTop: {
      description:
        "Enlaces de la barra superior (Top Bar), usualmente para cambio de contexto.",
      control: "object",
      table: { category: "Navigation" }
    },
    buttonContact: {
      description: "Propiedades del botón de acción principal (ej. Contratar).",
      control: "object",
      table: { category: "Actions" }
    },
    sessionLink: {
      description:
        "Configuración para el acceso de usuarios (Login) con icono y etiqueta.",
      control: "object",
      table: { category: "Actions" }
    },
    linkComponent: {
      description:
        "Componente de enrutamiento externo (Next.js Link o React Router Link).",
      table: { category: "Behavior" }
    },
    navbarVariant: {
      description: "Variante de visualización del navbar. Permite controlar qué elementos se muestran.",
      control: { type: "select" },
      options: ["default", "no_items", "simple", "none"],
      table: { category: "Behavior" }
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    navbarVariant: "default",
    sessionLink: {
      label: "Iniciar Sesión",
      icon: { name: "person" },
      href: "#"
    },
    buttonContact: {
      children: "Contratar",
      color: "secondary",
      type: "button",
      // href: "",
      onClick: () => alert("Clicked!")
    },
    navbarTop: [
      {
        href: "#",
        label: "Hogar",
        icon: { name: "home" }
      },
      {
        href: "#",
        label: "Empresas",
        icon: { name: "business" }
      }
    ],
    links: [
      {
        label: "Planes",
        links: [
          {
            href: "#",
            label: "Fibra Óptica",
            icon: { name: "settings_input_antenna" }
          },
          {
            href: "#",
            label: "Conexión Hibrida",
            icon: { name: "cloud_sync" }
          },
          {
            href: "#",
            label: "TV & Streaming",
            icon: { name: "live_tv" }
          }
        ]
      },
      {
        label: "Soporte",
        links: [
          {
            href: "#",
            label: "Canales de atención",
            icon: { name: "wifi_calling_3" }
          },
          {
            href: "#",
            label: "Preguntas frecuentes",
            icon: { name: "contact_support" }
          }
        ]
      },
      {
        label: "Promociones",
        children: (
          <div className="w-64 p-4">
            <div className="bg-primary-50 border-primary-100 rounded-xl border p-3">
              <span className="text-primary-700 mb-1 block text-xs font-bold">
                OFERTA DEL MES
              </span>
              <p className="text-sm text-gray-600">
                Obtén 50% extra de velocidad en planes de fibra.
              </p>
              <button className="text-primary-600 mt-2 text-xs font-bold hover:underline">
                Ver más
              </button>
            </div>
          </div>
        )
      },
      {
        label: "Cobertura",
        link: {
          href: "#",
          target: "_blank"
        }
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story:
          "Vista predeterminada que muestra el comportamiento de dropdowns, el ítem con contenido personalizado (children) y el sticky navbar."
      }
    }
  }
};

export const Simple: Story = {
  args: {
    navbarVariant: "simple"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Variante simplificada: solo muestra el logo con fondo primario. Ideal para flujos guiados como el flujo semiautomático."
      }
    }
  }
};

export const NoItems: Story = {
  args: {
    navbarVariant: "no_items"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Variante sin elementos de navegación: mantiene la estructura del navbar pero solo muestra el logo, sin links, botones ni barra superior."
      }
    }
  }
};

export const None: Story = {
  args: {
    navbarVariant: "none"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Variante sin navbar: no renderiza ningún elemento. Útil cuando la página requiere un encabezado completamente personalizado o ninguno."
      }
    }
  }
};

