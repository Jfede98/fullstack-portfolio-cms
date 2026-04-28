import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tab } from "../../lib/components";

const description = `
El componente **Tab** esta optimizado para la adaptabilidad en dispositivos móviles y una gestión fluida de contenidos.

### Características principales:
- **Layout Adaptativo**: Si existen más de 3 pestañas, en dispositivos móviles cambia automáticamente a un diseño de columna (icono arriba, texto abajo) para optimizar el espacio.
- **Scroll Inteligente**: En mobile, la lista de pestañas permite scroll horizontal con *snap-center*, asegurando que la pestaña seleccionada siempre se desplace al centro de la vista.
- **Estética Refinada**: Incluye separadores verticales de 1px entre ítems inactivos que desaparecen inteligentemente alrededor de la pestaña activa.
- **Animaciones**: Transiciones suaves de opacidad y desplazamiento lateral al cambiar entre paneles de contenido.

\`\`\`ts
interface TabClassName {
  base?: string;
  trigger?: string;
  triggerElementWrapper?: string;
  triggerLabel?: string;
  content?: string;
  wrapperContent?: string;
}
\`\`\`
`;

const meta = {
  component: Tab,
  title: "Layout/Tab",
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
    tabs: {
      description: "Array de objetos con la configuración de cada pestaña.",
      table: { category: "Data" }
    },
    className: {
      control: "object",
      description: "Clases CSS personalizadas",
      table: {
        category: "Styles",
        defaultValue: {
          summary: "TabClassName",
          detail: `{
  base?: string;
  trigger?: string;
  triggerElementWrapper?: string;
  triggerLabel?: string;
  content?: string;
  wrapperContent?: string;
}`
        }
      }
    }
  }
} satisfies Meta<typeof Tab>;

export default meta;
type Story = StoryObj<typeof meta>;

const tabsData = [
  {
    id: "1",
    label: "Fibra óptica",
    icon: { name: "settings_input_antenna", type: "outlined" as const },
    content: (
      <div className="space-y-4">
        <h3 className="text-h3 text-primary-900 font-bold">Fibra óptica</h3>
        <p className="text-body text-gray-600">
          Navega a la máxima velocidad con tecnología 100% fibra simétrica.
        </p>
      </div>
    )
  },
  {
    id: "2",
    label: "Conexión híbrida",
    icon: { name: "cloud_sync", type: "outlined" as const },
    content: (
      <div className="space-y-4">
        <h3 className="text-h3 text-primary-900 font-bold">Conexión híbrida</h3>
        <p className="text-body text-gray-600">
          Flexibilidad y estabilidad garantizada en cualquier ubicación.
        </p>
      </div>
    )
  },
  {
    id: "3",
    label: "Preferenciales",
    icon: { name: "volunteer_activism", type: "filled" as const },
    content: (
      <div className="space-y-4">
        <h3 className="text-h3 text-primary-900 font-bold">
          Planes preferenciales
        </h3>
        <p className="text-body text-gray-600">
          Beneficios exclusivos para clientes fidelizados.
        </p>
      </div>
    )
  }
];

export const Default: Story = {
  args: {
    className: {
      base: "",
      trigger: "",
      triggerElementWrapper: "",
      triggerLabel: "",
      content: "",
      wrapperContent: ""
    },
    tabs: tabsData
  },
  parameters: {
    docs: {
      description: {
        story:
          "Vista estándar con 3 pestañas. El layout se mantiene horizontal en todas las pantallas."
      }
    }
  }
};

export const LargeMenu: Story = {
  args: {
    tabs: [
      ...tabsData,
      {
        id: "4",
        label: "Soporte Técnico",
        icon: { name: "support_agent", type: "outlined" as const },
        content: (
          <div className="rounded-lg bg-gray-50 p-4">
            Asistencia inmediata para tu conexión.
          </div>
        )
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story:
          "Al superar los 3 ítems, el componente activa el layout responsivo de columna y scroll horizontal en dispositivos móviles."
      }
    }
  }
};


export const Rounded: Story = {
  args: {
    className: {
      base: "",
      trigger: "",
      triggerElementWrapper: "",
      triggerLabel: "",
      content: "",
      wrapperContent: ""
    },
    tabs: [
      {
        id: "1",
        label: "Plan 400 mb",
        content: (
          <div className="space-y-4">
            <h3 className="text-h3 text-primary-900 font-bold">Fibra óptica</h3>
            <p className="text-body text-gray-600">
              Navega a la máxima velocidad con tecnología 100% fibra simétrica.
            </p>
          </div>
        )
      },
      {
        id: "2",
        label: "Plan 700 mb",
        content: (
          <div className="space-y-4">
            <h3 className="text-h3 text-primary-900 font-bold">
              Conexión híbrida
            </h3>
            <p className="text-body text-gray-600">
              Flexibilidad y estabilidad garantizada en cualquier ubicación.
            </p>
          </div>
        )
      },
      {
        id: "3",
        label: "Plan 1000 mb",
        content: (
          <div className="space-y-4">
            <h3 className="text-h3 text-primary-900 font-bold">
              Planes preferenciales
            </h3>
            <p className="text-body text-gray-600">
              Beneficios exclusivos para clientes fidelizados.
            </p>
          </div>
        )
      }
    ],
    rounded: true
  },
  parameters: {
    docs: {
      description: {
        story:
          "Vista estándar con 3 pestañas. El layout se mantiene horizontal en todas las pantallas con un diseño de borde redondeado."
      }
    }
  }
};

export const SingleTabWithoutLabel: Story = {
  args: {
    tabs: [
      {
        id: "1",
        content: (
          <div className="space-y-4">
            <h3 className="text-h3 text-primary-900 font-bold">Contenido único</h3>
            <p className="text-body text-gray-600">
              Cuando solo hay una categoría sin etiqueta, no se muestra la navegación.
              Solo se renderiza el contenido directamente ya que no tiene sentido mostrar
              controles para cambiar entre opciones cuando no hay opciones adicionales.
            </p>
          </div>
        )
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story:
          "Con una sola tab **sin label**, la navegación se oculta automáticamente. Solo se muestra el contenido."
      }
    }
  }
};

export const SingleTabWithLabel: Story = {
  args: {
    tabs: [
      {
        id: "1",
        label: "Información general",
        icon: { name: "info", type: "outlined" as const },
        content: (
          <div className="space-y-4">
            <h3 className="text-h3 text-primary-900 font-bold">Información general</h3>
            <p className="text-body text-gray-600">
              Cuando hay una sola tab pero tiene label, la navegación sí se muestra.
              Esto es útil para casos donde se quiere mantener la consistencia visual
              o indicar explícitamente la categoría del contenido.
            </p>
          </div>
        )
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story:
          "Con una sola tab **con label**, la navegación se mantiene visible para dar contexto del contenido."
      }
    }
  }
};
