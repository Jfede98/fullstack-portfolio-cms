import type { Meta, StoryObj } from "@storybook/react-vite";
import { Navigation } from "../../lib/components/carousel/navigation";
import Img1 from "../../assets/img/banner4.webp";
import Img2 from "../../assets/img/banner3.webp";
import Img3 from "../../assets/img/banner2.webp";
import Img4 from "../../assets/img/banner1.webp";

const description = `
El componente **Navigation** es una barra de control compuesta diseñada para integrarse con carruseles o secciones de contenido dinámico. Funciona como un contenedor de alto nivel que agrupa elementos informativos y de acción.

#### Capacidades:
- **Composición de Controles**: Integra automáticamente el componente \`Arrow\` para las acciones de navegación.
- **Contexto Visual**: Permite la inclusión de un \`AvatarGroup\` para mostrar usuarios relacionados o participantes.
- **Etiquetado Dinámico**: Incluye un slot para texto central que puede ser utilizado para títulos de sección o indicadores de estado.
- **Layout Flexible**: Diseñado para mantener una alineación coherente entre los botones de navegación y el contenido central.
`;

const meta = {
  component: Navigation,
  title: "Carousel/Navigation",
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
    buttons: {
      description:
        "Arreglo de objetos con las propiedades de cada botón (componente Arrow).",
      control: "object",
      table: { category: "Content" }
    },
    text: {
      description: "Texto opcional para mostrar en el centro del componente.",
      control: "text",
      table: { category: "Content" }
    },
    avatarGroup: {
      description: "Objeto con las propiedades del grupo de avatares.",
      control: "object",
      table: { category: "Content" }
    },
    className: {
      control: "object",
      description: "Clases CSS personalizadas.",
      table: {
        category: "Styles",
        defaultValue: { summary: "'{base: '', text: ''}'" }
      }
    }
  }
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: { base: "", text: "" },
    text: "Bienvenida",
    avatarGroup: {
      size: "sm",
      border: true,
      animation: true,
      avatars: [
        { src: Img1 as unknown as string },
        { src: Img2 as unknown as string, active: true },
        { src: Img3 as unknown as string },
        { src: Img4 as unknown as string }
      ]
    },
    buttons: [
      {
        className: { base: "", icon: "" },
        id: "arrow-l",
        size: "lg",
        direction: "left"
      },
      {
        className: { base: "", icon: "" },
        id: "arrow-r",
        size: "lg",
        direction: "right"
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story:
          "Vista completa del componente utilizando todas sus capacidades: navegación lateral, título central y grupo de avatares decorativo."
      }
    }
  }
};

export const Text: Story = {
  args: {
    className: { base: "", text: "" },
    text: "Explorar más",
    buttons: [
      { id: "arrow-l", size: "lg", direction: "left" },
      { id: "arrow-r", size: "lg", direction: "right" }
    ]
  },
  parameters: {
    docs: {
      description: {
        story:
          "Configuración simplificada que prioriza el texto descriptivo junto a los controles de dirección. Ideal para carruseles de noticias o banners informativos."
      }
    }
  }
};

export const Avatars: Story = {
  args: {
    className: { base: "", text: "" },
    avatarGroup: {
      size: "sm",
      border: true,
      animation: true,
      avatars: [
        { src: Img1 as unknown as string },
        { src: Img2 as unknown as string },
        { src: Img3 as unknown as string }
      ]
    },
    buttons: [
      { id: "arrow-l", size: "lg", direction: "left" },
      { id: "arrow-r", size: "lg", direction: "right" }
    ]
  },
  parameters: {
    docs: {
      description: {
        story:
          "Variante que sustituye el texto por un grupo de avatares. Útil para galerías de fotos de equipo o perfiles de usuarios."
      }
    }
  }
};

export const AvatarActiveAction: Story = {
  args: {
    className: { base: "", text: "" },
    text: "Explorar más",
    avatarGroup: {
      size: "sm",
      border: true,
      animation: true,
      avatars: [
        { src: Img1 as unknown as string },
        { src: Img2 as unknown as string, active: true },
        { src: Img3 as unknown as string },
        { src: Img4 as unknown as string }
      ]
    },
    buttons: [
      { id: "arrow-l", size: "lg", direction: "left" },
      { id: "arrow-r", size: "lg", direction: "right" }
    ]
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demuestra la capacidad de **destacar un miembro** dentro del grupo. Al marcar un avatar con la propiedad `active: true`, el componente lo reordena automáticamente al final de la lista. En un contexto de solapamiento por márgenes negativos, esto garantiza que el elemento activo se posicione visualmente sobre los demás, sin necesidad de manipular manualmente los índices de profundidad (z-index)."
      }
    }
  }
};
