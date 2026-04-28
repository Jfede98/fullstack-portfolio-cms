import type { Meta, StoryObj } from "@storybook/react-vite";
import { InfoCardSlider } from "../../lib/components/infoCardSlider";

const description = `
El componente **InfoCardSlider** muestra múltiples InfoCards en un slider horizontal.

#### Características Principales:
- **Grid Responsivo**: Muestra 4 cards en desktop, se adapta en mobile
- **Slider Horizontal**: Cuando no caben todas, se puede deslizar horizontalmente
- **Breakpoints**:
  - Mobile: 1 card
  - Tablet (768px): 2 cards
  - Desktop (1024px): 3 cards
  - Large (1400px): 4 cards
`;

const meta = {
  component: InfoCardSlider,
  title: "Layout/InfoCardSlider",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: description
      }
    }
  }
} satisfies Meta<typeof InfoCardSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cards: [
      {
        image: "https://placehold.co/48x48/png",
        imageAlt: "Servicio 1",
        title: "Servicio Premium",
        description: "Accede a todos los beneficios de nuestro servicio premium con la mejor calidad."
      },
      {
        image: "https://placehold.co/48x48/png",
        imageAlt: "Servicio 2",
        title: "Atención 24/7",
        description: "Soporte técnico disponible las 24 horas del día, los 7 días de la semana."
      },
      {
        image: "https://placehold.co/48x48/png",
        imageAlt: "Servicio 3",
        title: "Instalación Gratis",
        description: "Instalación profesional sin costo adicional en tu domicilio."
      },
      {
        image: "https://placehold.co/48x48/png",
        imageAlt: "Servicio 4",
        title: "Garantía Extendida",
        description: "Protección completa con nuestra garantía extendida de 2 años."
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: "Muestra 4 cards en grid responsivo (sin slider)."
      }
    }
  }
};

export const WithSlider: Story = {
  args: {
    cards: [
      {
        image: "https://placehold.co/48x48/png",
        imageAlt: "Servicio 1",
        title: "Servicio Premium",
        description: "Accede a todos los beneficios de nuestro servicio premium."
      },
      {
        image: "https://placehold.co/48x48/png",
        imageAlt: "Servicio 2",
        title: "Atención 24/7",
        description: "Soporte técnico disponible las 24 horas del día."
      },
      {
        image: "https://placehold.co/48x48/png",
        imageAlt: "Servicio 3",
        title: "Instalación Gratis",
        description: "Instalación profesional sin costo adicional."
      },
      {
        image: "https://placehold.co/48x48/png",
        imageAlt: "Servicio 4",
        title: "Garantía Extendida",
        description: "Protección completa con garantía de 2 años."
      },
      {
        image: "https://placehold.co/48x48/png",
        imageAlt: "Servicio 5",
        title: "WiFi de Alta Velocidad",
        description: "Conexión ultra rápida para toda tu familia."
      },
      {
        image: "https://placehold.co/48x48/png",
        imageAlt: "Servicio 6",
        title: "Streaming Ilimitado",
        description: "Disfruta de tus series y películas favoritas."
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: "Cuando hay más de 4 cards, se activa el slider horizontal."
      }
    }
  }
};
