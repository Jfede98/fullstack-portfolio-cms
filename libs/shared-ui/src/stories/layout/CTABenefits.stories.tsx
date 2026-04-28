import type { Meta, StoryObj } from "@storybook/react-vite";
import { CTABenefits } from "../../lib/components/CTABenefits";

const description = `
Componente que muestra los beneficios de un producto o servicio sobre un fondo específico
`;

const meta = {
  component: CTABenefits,
  title: "Layout/CTABenefits",
  tags: ["autodocs"],
  excludeStories: /Data$/,
  parameters: {
    docs: {
      description: {
        component: description
      }
    },
    backgrounds: {
      default: "dark"
    }
  },
  argTypes: {
    title: {
      table: { category: "Content" },
      control: "object",
      description: "Título principal del CTA (Typography: { text, tag })"
    },
    subtitle: {
      table: { category: "Content" },
      control: "text",
      description: "Subtítulo descriptivo"
    },
    backgroundImage: {
      table: { category: "Content" },
      control: "text",
      description: "URL de la imagen de fondo (opcional)"
    },
    features: {
      table: {
        category: "Content",
        type: {
          summary: "Feature[]",
          detail: "Array<{ iconName: string, text: string }>"
        }
      },
      control: "object",
      description:
        "Array de características con iconName (nombre del icono de Material Icons) y texto descriptivo"
    },
    icon: {
      table: {
        category: "Styles",
        type: {
          summary: "IIconStyleProps",
          detail:
            "{ type?: 'filled' | 'outlined' | 'rounded' | 'sharp' | 'two-tone', size?: 'sm' | 'msm' | 'md' | 'lg' | 'xl', color?: string }"
        },
        defaultValue: {
          summary: "{ type: '', size: '', color: '' }"
        }
      },
      control: "object",
      description:
        "Propiedades opcionales para personalizar los iconos. Valores aplicados por defecto en el componente: color='text-white', size='msm'"
    },
    button: {
      table: {
        category: "Styles",
        type: {
          summary: "IButtonStyleProps",
          detail:
            "{ color?: 'primary' | 'secondary' | 'tertiary' | 'outline', size?: 'sm' | 'msm' | 'md' | 'lg' | 'xl' | 'full' | 'fit' }"
        },
        defaultValue: {
          summary: "{ color: '', size: '' }"
        }
      },
      control: "object",
      description:
        "Propiedades opcionales para personalizar el botón. Valores aplicados por defecto en el componente: color='secondary', size='fit'"
    },
    className: {
      table: {
        category: "Styles",
        type: {
          summary: "ICTABenefitsClassName",
          detail:
            "{ wrapper?: string, base?: string, title?: string, subtitle?: string, featuresContainer?: string, featureItem?: string, featureText?: string }"
        },
        defaultValue: {
          summary:
            "{ wrapper: '', base: '', title: '', subtitle: '', featuresContainer: '', featureItem: '', featureText: '' }"
        }
      },
      control: "object",
      description: "Clases CSS personalizadas para cada elemento del componente"
    }
  }
} satisfies Meta<typeof CTABenefits>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Ejemplo básico del componente CTABenefits con imagen de fondo."
      }
    }
  },
  args: {
    title: { text: "¿Listo para tener el mejor internet?", tag: "h2" },
    subtitle: "Disfruta de la mejor conexión en cualquier rincón de tu hogar ",
    button: { children: "¡Contrátalo ahora!" },
    backgroundImage:
      "https://www.panoramaaudiovisual.com/wp-content/uploads/2024/02/Max-HBO-Max-Warner-Bros-Discovery-Latinaomerica.jpg",
    features: [
      { iconName: "access_time", text: "Soporte 24/7" },
      { iconName: "vpn_lock", text: "Sin cortes" },
      { iconName: "live_tv", text: "Entretenimiento incluido" }
    ]
  }
};

export const WithCustomStyles: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo con clases CSS personalizadas aplicadas a diferentes elementos."
      }
    }
  },
  args: {
    title: { text: "¿Listo para tener el mejor internet?", tag: "h2" },
    subtitle: "Disfruta de la mejor conexión en cualquier rincón de tu hogar ",
    button: { children: "¡Contrátalo ahora!" },
    backgroundImage:
      "https://www.panoramaaudiovisual.com/wp-content/uploads/2024/02/Max-HBO-Max-Warner-Bros-Discovery-Latinaomerica.jpg",
    features: [
      { iconName: "access_time", text: "Soporte 24/7" },
      { iconName: "vpn_lock", text: "Sin cortes" },
      { iconName: "live_tv", text: "Entretenimiento incluido" }
    ],
    className: {
      wrapper: "shadow-2xl",
      title: "text-3xl font-bold",
      subtitle: "text-lg",
      featureText: "font-semibold"
    }
  }
};

export const WithoutBackgroundImage: Story = {
  parameters: {
    docs: {
      description: {
        story: "Ejemplo del componente sin imagen de fondo, solo con color."
      }
    }
  },
  args: {
    title: { text: "¿Listo para tener el mejor internet?", tag: "h2" },
    subtitle: "Disfruta de la mejor conexión en cualquier rincón de tu hogar ",
    button: { children: "¡Contrátalo ahora!" },
    features: [
      { iconName: "access_time", text: "Soporte 24/7" },
      { iconName: "vpn_lock", text: "Sin cortes" },
      { iconName: "live_tv", text: "Entretenimiento incluido" }
    ]
  }
};

export const WithCustomIcons: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo con iconos personalizados usando la propiedad icon para cambiar type, size y color."
      }
    }
  },
  args: {
    title: { text: "¿Listo para tener el mejor internet?", tag: "h2" },
    subtitle: "Disfruta de la mejor conexión en cualquier rincón de tu hogar ",
    button: { children: "¡Contrátalo ahora!" },
    backgroundImage:
      "https://www.panoramaaudiovisual.com/wp-content/uploads/2024/02/Max-HBO-Max-Warner-Bros-Discovery-Latinaomerica.jpg",
    features: [
      { iconName: "access_time", text: "Soporte 24/7" },
      { iconName: "vpn_lock", text: "Sin cortes" },
      { iconName: "live_tv", text: "Entretenimiento incluido" }
    ],
    icon: {
      type: "outlined",
      size: "lg",
      color: "text-secondary"
    }
  }
};

export const WithCustomButton: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo con botón personalizado usando la propiedad button para cambiar color y size."
      }
    }
  },
  args: {
    title: { text: "¿Listo para tener el mejor internet?", tag: "h2" },
    subtitle: "Disfruta de la mejor conexión en cualquier rincón de tu hogar ",
    button: { children: "¡Contrátalo ahora!", color: "primary", size: "lg" },
    backgroundImage:
      "https://www.panoramaaudiovisual.com/wp-content/uploads/2024/02/Max-HBO-Max-Warner-Bros-Discovery-Latinaomerica.jpg",
    features: [
      { iconName: "access_time", text: "Soporte 24/7" },
      { iconName: "vpn_lock", text: "Sin cortes" },
      { iconName: "live_tv", text: "Entretenimiento incluido" }
    ]
  }
};

export const FullyCustomized: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo completamente personalizado con iconos, botón y estilos CSS personalizados."
      }
    }
  },
  args: {
    title: { text: "¿Listo para tener el mejor internet?", tag: "h2" },
    subtitle: "Disfruta de la mejor conexión en cualquier rincón de tu hogar ",
    button: { children: "¡Contrátalo ahora!", color: "primary", size: "xl" },
    backgroundImage:
      "https://www.panoramaaudiovisual.com/wp-content/uploads/2024/02/Max-HBO-Max-Warner-Bros-Discovery-Latinaomerica.jpg",
    features: [
      { iconName: "access_time", text: "Soporte 24/7" },
      { iconName: "vpn_lock", text: "Sin cortes" },
      { iconName: "live_tv", text: "Entretenimiento incluido" }
    ],
    icon: {
      type: "outlined",
      size: "lg",
      color: "text-secondary"
    },
    className: {
      wrapper: "shadow-2xl",
      title: "text-4xl font-bold",
      subtitle: "text-xl"
    }
  }
};
