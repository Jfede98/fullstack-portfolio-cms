import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal } from "../../lib/components/modal";
import { Button } from "../../lib/components/button";
import { useState } from "react";

const description = `
El componente **Modal** es un diálogo modal que utiliza **Framer Motion** para animaciones suaves.

### Ejemplo de uso básico:

\`\`\`tsx
const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <h2>Título</h2>
  <p>Contenido del modal</p>
</Modal>
\`\`\`
`;

const meta = {
  component: Modal,
  title: "Utilities/Modal",
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
    isOpen: {
      control: "boolean",
      description: "Controla si el modal está visible o no.",
      table: {
        category: "State",
        type: { summary: "boolean" },
        defaultValue: { summary: "false" }
      }
    },
    onClose: {
      description: "Función callback que se ejecuta al cerrar el modal.",
      action: "closed",
      table: {
        category: "Events",
        type: { summary: "() => void" }
      }
    },
    children: {
      control: "ReactNode",
      description: "El contenido principal del modal.",
      table: {
        category: "Content",
        type: { summary: "ReactNode" }
      }
    },
    size: {
      control: {
        type: "select",
        options: ["sm", "md", "lg", "xl", "full"]
      },
      description: "Tamaño del modal.",
      table: {
        category: "Appearance",
        type: { summary: "sm | md | lg | xl | full" },
        defaultValue: { summary: "md" }
      }
    },
    showCloseButton: {
      control: "boolean",
      description: "Muestra u oculta el botón X para cerrar el modal.",
      table: {
        category: "Appearance",
        type: { summary: "boolean" },
        defaultValue: { summary: "true" }
      }
    },
    className: {
      control: "text",
      description: "Clases CSS personalizadas para el contenido del modal.",
      table: {
        category: "Styles",
        type: { summary: "string" }
      }
    }
  }
} satisfies Meta<unknown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    children: <p>Contenido</p>
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Abrir Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <h2 className="text-xl font-semibold mb-4">Modal Básico</h2>
          <p>Este es un modal con Framer Motion.</p>
          <p>Tiene animaciones suaves de entrada y salida.</p>
        </Modal>
      </>
    );
  }
};

export const WithButtons: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    children: <p>Contenido</p>
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Abrir Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <h2 className="text-xl font-semibold mb-4">Confirmar acción</h2>
          <p>¿Estás seguro de que deseas realizar esta acción?</p>
          <p>Esta operación es importante y requiere confirmación.</p>
          <div className="flex items-center justify-end gap-3 mt-6">
            <Button color="secondary" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsOpen(false)}>
              Confirmar
            </Button>
          </div>
        </Modal>
      </>
    );
  }
};

export const SizeSm: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    size: "sm",
    children: <p>Contenido</p>
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Small Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <h2 className="text-xl font-semibold mb-4">Modal Pequeño</h2>
          <p>Este es un modal pequeño (max-w-sm).</p>
        </Modal>
      </>
    );
  }
};

export const SizeLg: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    size: "lg",
    children: <p>Contenido</p>
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Large Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <h2 className="text-xl font-semibold mb-4">Modal Grande</h2>
          <p>Este es un modal grande (max-w-2xl).</p>
          <p>Perfecto para contenido más extenso como formularios complejos.</p>
        </Modal>
      </>
    );
  }
};

export const SizeXl: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    size: "xl",
    children: <p>Contenido</p>
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Extra Large Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <h2 className="text-xl font-semibold mb-4">Modal Extra Grande</h2>
          <p>Este es un modal extra grande (max-w-4xl).</p>
          <p>Ideal para dashboards, tablas o contenido rico.</p>
        </Modal>
      </>
    );
  }
};

export const SizeFull: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    size: "full",
    children: <p>Contenido</p>
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Full Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <h2 className="text-xl font-semibold mb-4">Modal Pantalla Completa</h2>
          <p>Este es un modal de pantalla completa (max-w-[95vw]).</p>
          <p>Utiliza casi todo el ancho de la ventana del navegador.</p>
        </Modal>
      </>
    );
  }
};

export const NoCloseButton: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    showCloseButton: false,
    children: <p>Contenido</p>
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Abrir Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <h2 className="text-xl font-semibold mb-4">Sin botón de cerrar</h2>
          <p>Este modal no tiene el botón X en el header.</p>
          <p>Solo se puede cerrar mediante el botón aquí dentro.</p>
          <div className="mt-6">
            <Button onClick={() => setIsOpen(false)}>
              Entendido
            </Button>
          </div>
        </Modal>
      </>
    );
  }
};
