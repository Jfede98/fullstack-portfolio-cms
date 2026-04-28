import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfoCard } from "../../lib/components/cards/infoCard";

const description = `
El componente **InfoCard** muestra una tarjeta informativa con imagen, título y descripción.

#### Características Principales:
- **Imagen**: Icono o imagen pequeña en la parte superior
- **Título**: Color morado (#562577), font-weight 700
- **Descripción**: Color gris (#6A7180), font-weight 400
- **Alineación**: Todo el contenido alineado a la izquierda
- **Fondo**: Color gris claro (#F6F6F6)

#### Guía de Uso:
1. Ideal para mostrar información de servicios o características
2. La imagen es opcional
3. Perfecto para grids de información
`;

const meta = {
  component: InfoCard,
  title: "Cards/InfoCard",
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
    image: {
      description: "URL de la imagen o icono",
      control: "text",
      table: {
        category: "Display"
      }
    },
    imageAlt: {
      description: "Texto alternativo para la imagen",
      control: "text",
      table: {
        category: "Display"
      }
    },
    title: {
      description: "Título de la tarjeta",
      control: "text",
      table: {
        category: "Display"
      }
    },
    description: {
      description: "Descripción de la tarjeta",
      control: "text",
      table: {
        category: "Display"
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
} satisfies Meta<typeof InfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    image: "https://placehold.co/48x48/png",
    imageAlt: "Icono de servicio",
    title: "Título de la tarjeta",
    description: "Esta es una descripción de ejemplo para la tarjeta informativa. Puede contener información relevante sobre el servicio o característica."
  },
  parameters: {
    docs: {
      description: {
        story: "Ejemplo básico de la tarjeta informativa con todos sus elementos."
      }
    }
  }
};

export const WithoutImage: Story = {
  args: {
    title: "Sin imagen",
    description: "Esta tarjeta no tiene imagen, solo título y descripción."
  },
  parameters: {
    docs: {
      description: {
        story: "Ejemplo de tarjeta sin imagen."
      }
    }
  }
};
