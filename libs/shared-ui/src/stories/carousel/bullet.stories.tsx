import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bullet } from "../../lib/components/carousel/bullet";

const description = `
El componente **Bullet** es un indicador de paginación reactivo diseñado para trabajar con carruseles. 
A diferencia de un bullet estático, este componente integra un **sistema de carga progresiva** mediante pseudo-elementos (::after) y variables de CSS.

### Características clave:
- **Animación sincronizada**: Utiliza la variable CSS \`--bullet-duration\` para definir el tiempo de carga.
- **Control de estado**: Soporta estados de actividad y pausa (\`isPaused\`).
- **Optimización TW4**: Implementado con utilidades nativas de Tailwind 4 para alto rendimiento.
`;

const meta = {
  component: Bullet,
  title: "Carousel/Bullet",
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
    active: {
      control: "boolean",
      description: "Define si el bullet representa el slide actual y activa la barra de carga.",
      table: { category: "State" }
    },
    isPaused: {
      control: "boolean",
      description: "Detiene la animación de carga en el punto actual (útil para eventos de hover).",
      table: { category: "State" }
    },
    duration: {
      control: { type: "number", step: 500 },
      description: "Tiempo en milisegundos que tarda la barra en completarse.",
      table: { category: "Animation", defaultValue: { summary: "3000" } }
    },
    onEnd: {
      action: "animation-ended",
      description: "Callback ejecutado cuando la barra de carga llega al 100%.",
      table: { category: "Events" }
    },
    onClick: {
      action: "clicked",
      description: "Evento disparado al hacer click en el bullet.",
      table: { category: "Events" }
    },
    className: {
      control: "object",
      description: "Objeto para personalizar las clases base del componente.",
      table: {
        category: "Styles",
        defaultValue: { summary: "{ base: '' }" }
      }
    }
  }
} satisfies Meta<typeof Bullet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: { base: "" },
    active: false
  },
  parameters: {
    docs: {
      description: {
        story: "Estado base del bullet cuando no está seleccionado. Se visualiza como un círculo pequeño estático."
      }
    }
  }
};

export const ActiveLoader: Story = {
  args: {
    className: { base: "" },
    active: true,
    duration: 6000,
    isPaused: false
  },
  parameters: {
    docs: {
      description: {
        story: "Estado activo con carga. El componente se expande y activa el pseudo-elemento para mostrar el progreso visual basado en la duración proporcionada."
      }
    }
  }
};

export const Paused: Story = {
  args: {
    ...ActiveLoader.args,
    isPaused: true
  },
  parameters: {
    docs: {
      description: {
        story: "Demostración de la funcionalidad de pausa. La animación se congela gracias a la clase `animate-bullet-paused`, simulando la interacción del usuario sobre el carrusel."
      }
    }
  }
};