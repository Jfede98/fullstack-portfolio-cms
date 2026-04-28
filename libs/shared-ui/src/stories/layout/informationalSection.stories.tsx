import type { Meta, StoryObj } from "@storybook/react-vite";
import { InformationalSection } from "../../lib/components/informationalSection";

const description = `
El componente **InformationalSection** presenta contenido informativo estructurado con un diseño equilibrado entre texto e imagen. Es ideal para destacar características de productos o servicios de manera visual y atractiva.

## Propiedades

- **title**: Título principal de la sección (Typography: { text, tag })
- **subtitle**: Subtítulo descriptivo opcional (Typography: { text, tag })
- **description**: Texto descriptivo o contenido adicional
- **cta**: Botón de llamada a la acción
- **image**: Objeto con src y alt para la imagen destacada
- **className**: Objeto opcional para personalizar los estilos de cada parte del componente:
  - \`wrapper\`: Contenedor principal
  - \`titleStyle\`: Estilo del título
  - \`subtitleStyle\`: Estilo del subtítulo
  - \`descriptionStyle\`: Estilo de la descripción
  - \`ctaStyle\`: Estilo del botón CTA
  - \`imageContainer\`: Contenedor de la imagen
  - \`imageStyle\`: Estilo de la imagen
  - \`textContainer\`: Contenedor del texto

## Uso recomendado

Utiliza este componente para presentar información de manera visual y estructurada, combinando texto e imágenes de forma equilibrada. Es perfecto para secciones de landing pages, presentación de servicios o características destacadas.
`;

const meta = {
  component: InformationalSection,
  title: "Layout/InformationalSection",
  tags: ["autodocs"],
  excludeStories: /Data$/,
  parameters: {
    docs: {
      description: {
        component: description
      }
    },
    backgrounds: {
      default: "light"
    }
  },
  argTypes: {
    title: {
      table: { category: "Content" },
      control: "object",
      description: "Título principal (Typography: { text, tag })"
    },
    subtitle: {
      table: { category: "Content" },
      control: "object",
      description: "Subtítulo descriptivo (Typography: { text, tag })"
    },
    description: {
      table: { category: "Content" },
      control: "text",
      description: "Texto descriptivo o contenido adicional"
    },
    cta: {
      table: {
        category: "Actions",
        type: {
          summary: "IButtonProps",
          detail: "Propiedades del botón de llamada a la acción"
        }
      },
      control: "object",
      description: "Botón de llamada a la acción"
    },
    image: {
      table: {
        category: "Media",
        type: {
          summary: "{ src: string, alt?: string }",
          detail: "Objeto con la URL de la imagen y texto alternativo"
        }
      },
      control: "object",
      description: "Objeto con src (URL de la imagen) y alt (texto alternativo)"
    },
    className: {
      table: {
        category: "Styles",
        type: {
          summary: "IInformationalSectionClassName",
          detail:
            "{ wrapper?: string, titleStyle?: string, subtitleStyle?: string, descriptionStyle?: string, ctaStyle?: string, imageContainer?: string, imageStyle?: string, textContainer?: string }"
        },
        defaultValue: {
          summary:
            "{ wrapper: '', titleStyle: '', subtitleStyle: '', descriptionStyle: '', ctaStyle: '', imageContainer: '', imageStyle: '', textContainer: '' }"
        }
      },
      control: "object",
      description: "Clases CSS personalizadas para cada elemento del componente"
    }
  }
} satisfies Meta<typeof InformationalSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo básico del componente InformationalSection con contenido de muestra mostrando título, subtítulo, descripción, imagen y botón de acción."
      }
    }
  },
  args: {
    title: { text: "Título Principal", tag: "h2" },
    subtitle: { text: "Subtítulo Descriptivo", tag: "h3" },
    description:
      "Esta es una descripción detallada que proporciona más información sobre el tema tratado en esta sección informativa, Esta es una descripción detallada que proporciona más información sobre el tema tratado en esta sección informativa, Esta es una descripción detallada que proporciona más información sobre el tema tratado en esta sección informativa.",
    cta: {
      children: "Llamado a la Acción"
    },
    image: {
      src: "https://www.panoramaaudiovisual.com/wp-content/uploads/2024/02/Max-HBO-Max-Warner-Bros-Discovery-Latinaomerica.jpg",
      alt: "Imagen de ejemplo para la sección informativa"
    }
  }
};

export const WithCustomStyles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo con clases CSS personalizadas aplicadas a diferentes elementos del componente."
      }
    }
  },
  args: {
    title: { text: "Conectividad sin Límites", tag: "h2" },
    subtitle: { text: "La mejor experiencia de navegación", tag: "h3" },
    description:
      "Disfruta de internet de alta velocidad con tecnología de fibra óptica. Navega, trabaja y juega sin interrupciones con planes diseñados para todas tus necesidades.",
    cta: {
      children: "Conocer más",
      color: "primary"
    },
    image: {
      src: "https://www.panoramaaudiovisual.com/wp-content/uploads/2024/02/Max-HBO-Max-Warner-Bros-Discovery-Latinaomerica.jpg",
      alt: "Imagen de servicios de conectividad"
    },
    className: {
      wrapper: "bg-gray-50 rounded-lg p-8",
      titleStyle: "text-primary-700",
      subtitleStyle: "text-secondary-600",
      descriptionStyle: "text-gray-700 leading-relaxed",
      imageContainer: "shadow-xl rounded-lg overflow-hidden"
    }
  }
};
