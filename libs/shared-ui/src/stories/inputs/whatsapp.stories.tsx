import type { Meta, StoryObj } from "@storybook/react-vite";
import { WhatsApp } from "../../lib/components";

const description = `
El componente **WhatsApp** permite generar un enlace directo a una conversación de WhatsApp utilizando un número de teléfono y un mensaje predefinido.
Internamente utiliza el componente **Link** como envoltorio, por lo que hereda sus propiedades y comportamiento. Esto facilita la navegación y la integración con el sistema de rutas existente.
Para más detalles sobre las propiedades disponibles, consulta la documentación del componente Link.
`;

const meta = {
  component: WhatsApp,
  title: "Inputs/WhatsApp",
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
    replace: { table: { disable: true } },
    scroll: { table: { disable: true } },
    shallow: { table: { disable: true } },
    locale: { table: { disable: true } },
    rel: { table: { disable: true } },
    prefetch: { table: { disable: true } },
    target: { table: { disable: true } },
    onNavigate: { table: { disable: true } },
    href: { table: { disable: true } },
    as: { table: { disable: true } },
    component: { table: { disable: true } },
    phoneNumber: {
      control: "text",
      description: "Número de teléfono",
      defaultValue: "",
      table: {
        category: "Specification"
      }
    },
    text: {
      control: "text",
      description: "Mensaje de texto para el whatsapp",
      defaultValue: "",
      table: {
        category: "Specification"
      }
    },
    className: {
      control: "object",
      description: "Clases CSS personalizadas para el enlace.",
      table: {
        category: "Styles",
        defaultValue: { summary: "_blank" }
      }
    }
  }
} satisfies Meta<unknown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: {
      base: "",
      img: "",
      text: ""
    },
    phoneNumber: "+593123456789",
    text: "Hola, ¿Necesitas ayuda?"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo básico del componente WhatsApp con un número de teléfono y un mensaje predefinido. Muestra el uso más común del componente."
      }
    }
  }
};
