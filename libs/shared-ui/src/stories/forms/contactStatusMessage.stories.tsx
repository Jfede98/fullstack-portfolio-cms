import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContactStatusMessage } from "../../lib/components/contactStatusMessage";

const meta = {
  component: ContactStatusMessage,
  title: "Forms/ContactStatusMessage",
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "radio",
      options: ["success", "error", "duplicated"],
      table: {
        category: "Content",
        type: { summary: "'success' | 'error' | 'duplicate'" }
      }
    },
    onAction: {
      action: "clicked",
      table: {
        category: "Actions"
      }
    },
    className: {
      control: "object",
      description: "Clases opcionales para personalizar cada slot.",
      table: {
        category: "Styles",
        type: {
          summary:
            "{ wrapper?: string; icon?: string; title?: string; description?: string; button?: string }"
        }
      }
    }
  },
  parameters: {
    docs: {
      description: {
        component:
          "Componente de respuesta para el formulario de contacto. Renderiza el icono, título, descripción y botón según el estado."
      }
    }
  }
} satisfies Meta<typeof ContactStatusMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    status: "success",
    title: "¡Listo!",
    description: "Hemos recibido tu solicitud. En breve nos comunicaremos.",
    buttonLabel: "Aceptar"
  }
};

export const Error: Story = {
  args: {
    status: "error",
    title: "¡Ups! Algo salió mal",
    description:
      "No pudimos procesar tu solicitud en este momento. Por favor, intenta enviar tus datos nuevamente.",
    buttonLabel: "Reintentar"
  }
};

export const Duplicate: Story = {
  args: {
    status: "duplicated",
    title: "Duplicado",
    description: "No pudimos procesar tu solicitud en este momento.",
    buttonLabel: "Reintentar"
  }
};
