import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContactForm } from "../../lib/components/contactForm";

const description = `
El componente **ContactForm** es un formulario de contacto con grid de 2 columnas.

#### Características Principales:
- **Grid 2 columnas**: Campos left/right se distribuyen en columnas
- **Campos full**: Ocupan ambas columnas (textarea)
- **Checkbox**: Sin fondo gris, con markdown support
- **Botón secondary**: Se habilita al aceptar términos
- **Responsive**: 1 columna en mobile, 2 en desktop
`;

const meta = {
  component: ContactForm,
  title: "Forms/ContactForm",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: description
      }
    }
  }
} satisfies Meta<typeof ContactForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fields: [
      {
        name: "nombre",
        label: "Nombre completo",
        type: "text",
        placeholder: "Ingresa tu nombre",
        required: true,
        column: "left"
      },
      {
        name: "email",
        label: "Correo electrónico",
        type: "email",
        placeholder: "correo@ejemplo.com",
        required: true,
        column: "right"
      },
      {
        name: "telefono",
        label: "Teléfono",
        type: "tel",
        placeholder: "+593 999 999 999",
        required: true,
        column: "left"
      },
      {
        name: "ciudad",
        label: "Ciudad",
        type: "text",
        placeholder: "Tu ciudad",
        required: true,
        column: "right"
      },
      {
        name: "mensaje",
        label: "Mensaje",
        type: "textarea",
        placeholder: "Cuéntanos más sobre tu consulta",
        required: false,
        column: "full"
      }
    ],
    checkboxLabel: "Acepto los [términos y condiciones](https://ejemplo.com/terminos) y la [política de privacidad](https://ejemplo.com/privacidad)",
    buttonText: "Enviar solicitud",
    onSubmit: (data) => console.log("Form submitted:", data)
  }
};

export const SimpleForm: Story = {
  args: {
    fields: [
      {
        name: "nombre",
        label: "Nombre",
        type: "text",
        required: true,
        column: "left"
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        column: "right"
      }
    ],
    checkboxLabel: "Acepto recibir información comercial",
    buttonText: "Enviar"
  }
};
