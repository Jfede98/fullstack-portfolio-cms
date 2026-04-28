import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListCard } from "../../lib/components/cards/listCard";

const description = `
El componente **ListCard** muestra una tarjeta con título y lista de items con iconos de check.

#### Características Principales:
- **Título**: Color morado (#562577), bold
- **Lista**: Items con icono de check circular
- **Icono**: Fondo gris (#D7DAE1), check morado (#83378F)
- **Texto**: Color gris (#6A7180)
- **Dimensiones**: 474px ancho x 290px alto mínimo
- **Borde**: 2px color #E3CDF5
- **Fondo**: Blanco
- **Layout**: Grid responsivo (se apilan en mobile)
`;

const meta = {
  component: ListCard,
  title: "Cards/ListCard",
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
    title: {
      description: "Título de la tarjeta",
      control: "text",
      table: {
        category: "Display"
      }
    },
    items: {
      description: "Lista de items a mostrar",
      control: "object",
      table: {
        category: "Data"
      }
    },
    className: {
      description: "Clases CSS personalizadas",
      control: "object",
      table: {
        category: "Styles"
      }
    }
  }
} satisfies Meta<typeof ListCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Requisitos",
    items: [
      "Persona natural o jurídica con RUC activo",
      "Experiencia en ventas o atención al cliente",
      "Local comercial o punto de venta",
      "Capacidad de inversión inicial"
    ]
  },
  parameters: {
    docs: {
      description: {
        story: "Ejemplo básico de ListCard con 4 items."
      }
    }
  }
};

export const WithManyItems: Story = {
  args: {
    title: "Beneficios del programa",
    items: [
      "Comisiones competitivas por venta",
      "Soporte técnico y comercial",
      "Material publicitario sin costo",
      "Capacitación continua",
      "Sistema de gestión de clientes",
      "Acceso a promociones exclusivas"
    ]
  },
  parameters: {
    docs: {
      description: {
        story: "Ejemplo con más items en la lista."
      }
    }
  }
};

export const TwoCards: Story = {
  args: {
    title: "",
    items: []
  },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1000px]">
      <ListCard
        title="Requisitos"
        items={[
          "Persona natural o jurídica con RUC activo",
          "Experiencia en ventas",
          "Local comercial",
          "Capacidad de inversión"
        ]}
      />
      <ListCard
        title="Beneficios"
        items={[
          "Comisiones competitivas",
          "Soporte técnico",
          "Material publicitario",
          "Capacitación continua"
        ]}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Ejemplo de dos cards lado a lado en grid responsivo."
      }
    }
  }
};
