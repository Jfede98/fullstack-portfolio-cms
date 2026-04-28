import type { Meta, StoryObj } from "@storybook/react-vite";
import { Icon, Tooltip } from "../../lib/components";

const description = `
El componente **Tooltip** utiliza **Tailwind Variants** para gestionar su posicionamiento y dimensiones. 
Está diseñado para aparecer al hacer hover sobre un elemento 'trigger', adaptándose al contenido largo mediante variantes de tamaño.
`;

const meta = {
  component: Tooltip,
  title: "Layout/Tooltip",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: description
      }
    },
    layout: "centered"
  },
  argTypes: {
    side: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
      description: "Posición del tooltip respecto al elemento hijo."
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "Ancho máximo del contenedor del tooltip."
    },
    content: {
      control: "text",
      description: "Texto o contenido que se mostrará dentro."
    },
    children: {
      control: false
    }
  }
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: "Información rápida",
    side: "top",
    size: "sm",
    children: (
      <Icon
        name="info"
        className={{ base: "h-5 w-5 cursor-pointer text-blue-500" }}
      />
    )
  }
};

export const LargeContent: Story = {
  args: {
    content:
      "Este es un ejemplo de contenido extendido para verificar que el wrap de Tailwind 4 y la variante de tamaño funcionan correctamente.",
    side: "right",
    size: "lg",
    children: (
      <button className="bg-secondary rounded-md px-4 py-2 text-sm font-medium">
        Pasa el mouse aquí
      </button>
    )
  },
  parameters: {
    docs: {
      story:
        "Demostración de cómo la variante 'lg' maneja múltiples líneas de texto."
    }
  }
};
