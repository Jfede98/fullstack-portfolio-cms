import type { Meta, StoryObj } from "@storybook/react-vite";
import { Benefits } from "../../lib/components/benefits";

const description = `
El componente **Benefits** muestra una lista de beneficios del servicio, cada uno acompañado de un ícono representativo, un título y una descripción breve. Este componente es ideal para resaltar las ventajas clave que ofrece una empresa, ayudando a captar la atención de los usuarios y a comunicar eficazmente el valor del servicio.

## Propiedades

- **title**: Título principal de la sección de beneficios
- **benefits**: Array de objetos con las propiedades \`icon\`, \`title\`, \`description\`, \`href\` (opcional) e \`isExternal\` (opcional)
- **layout**: Variante visual del componente (\`horizontal\` o \`vertical\`)
- **className**: Objeto opcional para personalizar los estilos de cada parte del componente:
  - \`base\`: Contenedor principal
  - \`titleStyle\`: Título de la sección
  - \`benefitsContainerStyle\`: Contenedor de todos los beneficios
  - \`benefitItemStyle\`: Cada item de beneficio individual
  - \`benefitsIconContainer\`: Contenedor del ícono
  - \`benefitsTitleStyle\`: Título de cada beneficio
  - \`benefitsDescriptionStyle\`: Descripción de cada beneficio
  - \`benefitContentStyle\`: Contenedor del texto de cada beneficio

## Mapeo desde Strapi (\`global.feature\` → \`global.button\`)

El campo \`name\` fue eliminado del componente \`global.feature\` en Strapi. Ahora todos los valores del item se extraen del componente \`global.button\` anidado:
- \`title\` ← \`button.label\`
- \`icon\` ← \`button.icon.name\`
- \`href\` ← \`button.href\`
- \`isExternal\` ← \`button.isExternalHref\`
`;

const meta = {
  component: Benefits,
  title: "Layout/Benefits",
  tags: ["autodocs"],
  excludeStories: /Data$/,
  argTypes: {
    title: {
      table: {
        category: "Display"
      },
      control: "object",
      description: "Título principal (Typography: { text, tag })"
    },
    benefits: {
      table: {
        category: "Display",
        type: {
          summary: "IBenefitsItems[]",
          detail: "Array<{ icon: string, title: string, description: string, href?: string, isExternal?: boolean }>"
        }
      },
      control: "object",
      description: "Array de beneficios a mostrar. `title` e `icon` se obtienen de `button.label` y `button.icon.name` en Strapi. Cuando `href` está presente, el item se envuelve en un `<a>`. `isExternal: true` abre en `_blank`."
    },
    icon: {
      table: {
        category: "Styles",
        type: {
          summary: "IIconStyleProps",
          detail: "{ type?: 'filled' | 'outlined' | 'rounded' | 'sharp' | 'two-tone', size?: 'sm' | 'msm' | 'md' | 'lg' | 'xl', color?: string }"
        },
        defaultValue: {
          summary: "{ type: '', size: '', color: '' }"
        }
      },
      control: "object",
      description: "Propiedades opcionales para personalizar los iconos. Valores aplicados por defecto en el componente: color='text-primary-500', size='xl'"
    },
    layout: {
      table: {
        category: "Display",
        type: {
          summary: "'horizontal' | 'vertical'"
        },
        defaultValue: {
          summary: "horizontal"
        }
      },
      options: ["horizontal", "vertical"],
      control: { type: "radio" },
      description: "Define la disposición visual de los beneficios"
    },
    className: {
      table: {
        category: "Styles",
        type: {
          summary: "IBenefitsClassName",
          detail: "{ base?: string, titleStyle?: string, benefitsContainerStyle?: string, benefitItemStyle?: string, benefitsIconContainer?: string, benefitsTitleStyle?: string, benefitsDescriptionStyle?: string, benefitContentStyle?: string }"
        },
        defaultValue: {
          summary: "{ base: '', titleStyle: '', benefitsContainerStyle: '', benefitItemStyle: '', benefitsIconContainer: '', benefitsTitleStyle: '', benefitsDescriptionStyle: '', benefitContentStyle: '' }"
        }
      },
      control: "object",
      description: "Objeto para personalizar los estilos del componente"
    }
  },
  parameters: {
    docs: {
      description: {
        component: description
      }
    }
  }
} satisfies Meta<typeof Benefits>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    layout: "horizontal",
    title: { text: "¿Por qué elegir Xtrim?", tag: "h2" },
    benefits: [
      {
        icon: "network_check",
        title: "Conexión confiable",
        description: "Red de fibra óptica de alta velocidad"
      },
      {
        icon: "timer",
        title: "Rápida instalación",
        description: "Técnicos certificados en 24-48 horas"
      },
      {
        icon: "access_time",
        title: "Soporte permanente",
        description: "Atención 24/7 todos los días del año"
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story:
          "Configuración estándar del componente Benefits mostrando tres beneficios clave con sus respectivos íconos, títulos y descripciones."
      }
    }
  }
};

export const Vertical: Story = {
  args: {
    layout: "vertical",
    title: { text: "¿Por qué elegir Xtrim?", tag: "h2" },
    benefits: [
      {
        icon: "network_check",
        title: "Experiencia y cobertura nacional",
        description: ""
      },
      {
        icon: "build",
        title: "Soporte técnico confiable",
        description: ""
      },
      {
        icon: "request_quote",
        title: "Planes claros, sin tecnicismos",
        description: ""
      }
    ],
    icon: {
      type: "outlined",
      size: "xl",
      color: "text-primary-500"
    }
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Variante vertical mobile-first para bloques de beneficios apilados, alineada al layout de Figma."
      }
    }
  },
  decorators: [
    (Story) => (
      <div
        style={{
          backgroundColor: "#EDE1F9",
          minHeight: "100vh",
          width: "100%"
        }}
      >
        <Story />
      </div>
    )
  ]
};

export const HorizontalWithoutTitle: Story = {
  args: {
    layout: "horizontal",
    benefits: [
      {
        icon: "network_check",
        title: "Conectividad segura",
        description: "Red 100% fibra óptica de alta velocidad y estabilidad"
      },
      {
        icon: "timer",
        title: "Rápida instalación",
        description: "En mínimo 24 a 48 Hrs."
      },
      {
        icon: "access_time",
        title: "Soporte permanente",
        description: "Atención todos los días del año"
      },
      {
        icon: "home",
        title: "Beneficios incluidos",
        description: "Valor agregado en cada plan"
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story:
          "Variante horizontal sin título, útil para bloques compactos de beneficios como el widget dentro del Hero."
      }
    }
  }
};

export const WithManyBenefits: Story = {
  args: {
    title: { text: "Servicios completos de conectividad", tag: "h2" },
    benefits: [
      {
        icon: "wifi",
        title: "Internet de alta velocidad",
        description: "Disfruta de velocidades de hasta 1 Gbps para toda tu familia"
      },
      {
        icon: "router",
        title: "Equipos modernos",
        description: "Router WiFi 6 de última generación incluido"
      },
      {
        icon: "security",
        title: "Conexión segura",
        description: "Protección avanzada contra amenazas y malware"
      },
      {
        icon: "cloud_done",
        title: "Almacenamiento en la nube",
        description: "100 GB de espacio gratuito para tus archivos"
      },
      {
        icon: "headset_mic",
        title: "Soporte técnico",
        description: "Equipo de expertos disponible cuando lo necesites"
      },
      {
        icon: "verified_user",
        title: "Garantía de servicio",
        description: "99.9% de disponibilidad garantizada"
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo con múltiples beneficios para mostrar cómo se adapta el componente con más contenido."
      }
    }
  }
};

export const WithLongContent: Story = {
  args: {
    title: { text: "Beneficios empresariales para tu negocio", tag: "h2" },
    benefits: [
      {
        icon: "business_center",
        title: "Soluciones empresariales personalizadas",
        description:
          "Ofrecemos paquetes diseñados específicamente para las necesidades de tu empresa, con opciones escalables que crecen junto con tu negocio y soporte dedicado para garantizar el máximo rendimiento"
      },
      {
        icon: "trending_up",
        title: "Mejora la productividad del equipo",
        description:
          "Con nuestra infraestructura de red de alta velocidad, tu equipo podrá trabajar más eficientemente, realizar videoconferencias sin interrupciones y acceder a recursos en la nube instantáneamente"
      },
      {
        icon: "support_agent",
        title: "Soporte prioritario y atención especializada",
        description:
          "Cuenta con un gestor de cuenta dedicado, soporte técnico 24/7 con tiempo de respuesta garantizado y acceso a nuestro equipo de expertos para consultas especializadas"
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo con contenido más extenso para demostrar cómo el componente maneja textos largos en títulos y descripciones."
      }
    }
  }
};

export const WithCustomStyles: Story = {
  args: {
    title: { text: "Ventajas exclusivas", tag: "h2" },
    benefits: [
      {
        icon: "star",
        title: "Calidad premium",
        description: "Servicio de primera clase"
      },
      {
        icon: "local_offer",
        title: "Precios competitivos",
        description: "La mejor relación calidad-precio"
      },
      {
        icon: "thumb_up",
        title: "Satisfacción garantizada",
        description: "O te devolvemos tu dinero"
      }
    ],
    className: {
      base: "bg-gray-50 py-12 px-6 rounded-2xl",
      titleStyle: "text-primary-600 font-bold",
      benefitItemStyle: "hover:scale-105 transition-transform duration-300",
      benefitsIconContainer: "bg-primary-100 border-2 border-primary-300"
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo utilizando la prop `className` para personalizar los estilos del componente, añadiendo fondo, bordes y efectos de hover."
      }
    }
  }
};

export const OnDarkBackground: Story = {
  args: {
    title: { text: "¿Por qué elegir Xtrim?", tag: "h2" },
    benefits: [
      {
        icon: "flash_on",
        title: "Velocidad máxima",
        description: "Internet ultrarrápido para todos tus dispositivos"
      },
      {
        icon: "shield",
        title: "Red protegida",
        description: "Seguridad incluida en todos nuestros planes"
      },
      {
        icon: "family_restroom",
        title: "Para toda la familia",
        description: "Planes diseñados para el uso de múltiples usuarios"
      }
    ],
    className: {
      titleStyle: "text-white",
      benefitsTitleStyle: "text-white",
      benefitsDescriptionStyle: "text-gray-300"
    }
  },
  parameters: {
    backgrounds: {
      default: "dark"
    },
    docs: {
      description: {
        story:
          "Ejemplo del componente sobre fondo oscuro, utilizando `className` para ajustar los colores del texto y mantener la legibilidad."
      }
    }
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-900 p-8 rounded-lg">
        <Story />
      </div>
    )
  ]
};

export const WithCustomIcons: Story = {
  args: {
    title: { text: "¿Por qué elegir Xtrim?", tag: "h2" },
    benefits: [
      {
        icon: "network_check",
        title: "Conexión confiable",
        description: "Red de fibra óptica de alta velocidad"
      },
      {
        icon: "timer",
        title: "Rápida instalación",
        description: "Técnicos certificados en 24-48 horas"
      },
      {
        icon: "access_time",
        title: "Soporte permanente",
        description: "Atención 24/7 todos los días del año"
      }
    ],
    icon: {
      type: "outlined",
      size: "lg",
      color: "text-secondary"
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo con iconos personalizados usando la propiedad icon para cambiar type, size y color de todos los iconos."
      }
    }
  }
};

export const WithHref: Story = {
  args: {
    layout: "vertical",
    title: { text: "Explora nuestros servicios", tag: "h2" },
    benefits: [
      {
        icon: "wifi",
        title: "Internet Hogar",
        description: "Planes de fibra óptica para tu hogar",
        href: "/internet-hogar",
        isExternal: false
      },
      {
        icon: "business",
        title: "Internet Empresarial",
        description: "Soluciones de conectividad para empresas",
        href: "/internet-empresarial",
        isExternal: false
      },
      {
        icon: "open_in_new",
        title: "Portal de clientes",
        description: "Accede a tu cuenta en el portal de autogestión",
        href: "https://clientes.xtrim.net",
        isExternal: true
      }
    ],
    icon: {
      type: "outlined",
      size: "xl",
      color: "text-primary-500"
    }
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Ejemplo de benefits con `href` en cada item. El título proviene del campo `label` del componente `global.button` de Strapi. Cuando `isExternal: true` el enlace abre en pestaña nueva (`target=\"_blank\"` + `rel=\"noopener noreferrer\"`). El `href` e `isExternal` se extraen de `button.href` y `button.isExternalHref` en el mapper."
      }
    }
  },
  decorators: [
    (Story) => (
      <div
        style={{
          backgroundColor: "#EDE1F9",
          minHeight: "100vh",
          width: "100%"
        }}
      >
        <Story />
      </div>
    )
  ]
};

