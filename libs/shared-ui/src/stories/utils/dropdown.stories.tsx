import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dropdown } from "../../lib/components";

const description = `
El componente **Dropdown** es un contenedor interactivo que oculta y revela contenido. Se compone de un disparador (*trigger*) y un panel desplegable (*content*).

#### Características:
- **Estado Controlado**: Gestiona internamente su visibilidad pero expone el evento \`onActive\` para sincronización externa.
- **Icono Integrado**: Incluye un icono de flecha que rota automáticamente 180° cuando el componente está activo.
- **Flexibilidad de Contenido**: Tanto el disparador como el contenido aceptan cualquier nodo de React, permitiendo menús, selectores o filtros complejos.
`;

const meta = {
  component: Dropdown,
  title: "Utilities/Dropdown",
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
    trigger: {
      description: "Elemento que dispara la apertura del dropdown",
      control: false,
      table: { category: "Display" }
    },
    content: {
      description: "Contenido que se muestra al estar activo",
      control: false,
      table: { category: "Display" }
    },
    hiddenArrowIcon: {
      description: "Si es verdadero, oculta el icono de flecha",
      control: "boolean",
      table: {
        category: "Styles",
        defaultValue: { summary: "false" }
      }
    },
    onActive: {
      description: "Función que se ejecuta al cambiar el estado de apertura",
      action: "onActive",
      table: { category: "Events" }
    },
    active: {
      description:
        "Si el valor es booleano, se desactiva el manejo del estado interno de la apertura para controlarlo desde un componente padre. Por el contrario si se desea que se maneje el evento interno de apertura, dejar esta propiedad en `undefined`",
      control: "boolean",
      table: {
        category: "Styles",
        defaultValue: { summary: "undefined" }
      }
    },
    className: {
      description:
        "Objeto para personalizar clases de los slots: base, trigger, content, icon",
      control: "object",
      table: { category: "Styles" }
    }
  }
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    trigger: <span>trigger</span>,
    content: <span>content</span>,
    hiddenArrowIcon: false,
    active: undefined,
    className: {
      base: "",
      trigger: "",
      content: ""
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Uso básico con un texto descriptivo y un panel de información simple."
      }
    }
  }
};

export const WithoutArrow: Story = {
  args: {
    trigger: (
      <div>
        <span>Menú sin flecha</span>
      </div>
    ),
    content: (
      <div className="rounded bg-gray-50 p-4">
        <span>El icono de la derecha ha sido ocultado.</span>
      </div>
    ),
    hiddenArrowIcon: true,
    active: undefined
  },
  parameters: {
    docs: {
      description: {
        story:
          "Variante sin el indicador visual de flecha, útil para triggers que ya tienen su propio lenguaje visual."
      }
    }
  }
};

export const Plans: Story = {
  args: {
    trigger: <span className="font-medium">Ver detalles</span>,
    content: (
      <div className="rounded p-4">
        <span className="block text-sm text-gray-300">
          Otras formas de pago
        </span>
        <span className="block text-sm text-gray-300">$18.99</span>
        <span className="block text-sm text-gray-300">
          $23.50 a partir del mes 7
        </span>
      </div>
    ),
    hiddenArrowIcon: false,
    active: undefined,
    className: {
      base: ["w-[600px]", "bg-gray-50", "p-4", "rounded-md"].join(" "),
      trigger: [
        "!w-fit",
        "justify-self-center",
        "px-4",
        "py-1",
        "rounded-sm",
        "text-primary-900",
        "hover:bg-primary-50"
      ].join(" ")
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Variante para indicador visual de planesw"
      }
    }
  }
};
