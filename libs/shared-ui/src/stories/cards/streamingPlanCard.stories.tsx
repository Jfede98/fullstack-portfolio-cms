import type { Meta, StoryObj } from "@storybook/react-vite";
import { StreamingPlanCard } from "../../lib/components/cards/streamingPlans";
import Img1 from "../../assets/svg/Zapping.svg";

const description = `
El componente **StreamingPlanCard** representa una tarjeta individual para un plan de streaming.

#### Caracteristicas principales:
- **Imagen destacada** con badge opcional
- **Titulo y descripcion** del plan
- **CTAs configurables** (principal y secundario opcional)
`;

const meta = {
  component: StreamingPlanCard,
  title: "Cards/StreamingPlans/Base",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: description
      }
    }
  },
  argTypes: {
    title: {
      description: "Nombre del plan",
      control: "text",
      table: {
        category: "Display"
      }
    },
    description: {
      description: "Descripcion del plan",
      control: "text",
      table: {
        category: "Display"
      }
    },
    badgeText: {
      description: "Texto del badge",
      control: "text",
      table: {
        category: "Display"
      }
    },
    image: {
      description: "Imagen del plan",
      control: "object",
      table: {
        category: "Media"
      }
    },
    ctas: {
      description: "Listado de CTAs",
      control: "object",
      table: {
        category: "Actions"
      }
    },
    className: {
      description: "Clases personalizadas por slot",
      control: "object",
      table: {
        category: "Styles"
      }
    }
  }
} satisfies Meta<typeof StreamingPlanCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Zapping",
    description: "Disfruta tus canales favoritos con la mejor calidad.",
    image: {
      src: Img1,
      alt: "Zapping"
    },
    badgeText: "Nuevo",
    ctas: [
      {
        label: "Contratar ahora",
        href: "#"
      },
      {
        label: "Contratar por WhatsApp",
        href: "https://wa.me/1234567890",
        icon: "WhatsappVector"
      }
    ]
  }
};
