import type { Meta, StoryObj } from "@storybook/react-vite";
import { AvatarGroup } from "../../../lib/components";
import Img1 from "../../../assets/img/banner4.webp";
import Img2 from "../../../assets/img/banner3.webp";
import Img3 from "../../../assets/img/banner2.webp";
import Img4 from "../../../assets/img/banner1.webp";

const description = `
El componente **AvatarGroup** permite agrupar múltiples componentes **Avatar** en una sola línea, creando un efecto de apilamiento visual. Es ideal para mostrar participantes de un equipo, usuarios activos en una plataforma o colaboradores de un proyecto.

#### Características:
- **Apilamiento Inteligente**: Los avatares se superponen de forma elegante para ahorrar espacio.
- **Control Unificado**: Permite definir el tamaño (\`size\`) y el borde (\`border\`) para todos los elementos del grupo simultáneamente.
- **Interacción Dinámica**: Incluye una opción de animación que resalta cada avatar cuando el usuario interactúa con él.
`;

const meta = {
  component: AvatarGroup,
  title: "Layout/Avatar/Group",
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
    avatars: {
      description: "Arreglo de objetos con las propiedades de cada avatar (src, alt, etc.).",
      control: "object",
      table: { category: "Content" }
    },
    size: {
      description: "Define el tamaño de todos los avatares en el grupo.",
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      table: {
        category: "Styles",
        defaultValue: { summary: "lg" }
      }
    },
    border: {
      description: "Añade un borde a cada avatar para mejorar la separación visual.",
      control: "boolean",
      table: { category: "Styles" }
    },
    animation: {
      description: "Activa efectos visuales (como escalado) al pasar el cursor sobre un avatar.",
      control: "boolean",
      table: { 
        category: "Interactions",
        defaultValue: { summary: "false" }
      }
    },
    className: {
      control: "object",
      description: "Objeto para personalizar clases (slot: base).",
      table: { category: "Styles" }
    }
  }
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: "xl",
    border: true,
    animation: true,
    avatars: [
      { src: Img1 as unknown as string },
      { src: Img2 as unknown as string },
      { src: Img3 as unknown as string },
      { src: Img4 as unknown as string }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: "Uso estándar del grupo con avatares de tamaño grande y animación de interacción habilitada."
      }
    }
  }
};

export const Compact: Story = {
  args: {
    size: "sm",
    border: true,
    animation: false,
    avatars: [
      { src: Img1 as unknown as string },
      { src: Img2 as unknown as string },
      { src: Img3 as unknown as string },
      { src: Img4 as unknown as string },
      { src: Img1 as unknown as string }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: "Versión compacta (sm). Útil para interfaces con espacio limitado o listas de usuarios densas."
      }
    }
  }
};

export const WithoutBorder: Story = {
  args: {
    size: "lg",
    border: false,
    avatars: [
      { src: Img1 as unknown as string },
      { src: Img2 as unknown as string },
      { src: Img3 as unknown as string }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: "Grupo de avatares sin borde decorativo, permitiendo una transición más suave entre las imágenes."
      }
    }
  }
};
