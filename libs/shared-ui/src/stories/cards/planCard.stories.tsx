import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlanCard } from "../../lib/components/cards/planCard";

const description = `
El componente **PlanCard** muestra una tarjeta de plan con detalles del servicio, precios, beneficios y opciones de contratación.

#### Características Principales:
- **Información del Plan**: Muestra velocidad, nombre del plan y precio promocional
- **Badge de Recomendación**: Opcionalmente muestra un badge cuando el plan es recomendado
- **Beneficios**: Lista de beneficios incluidos en el plan
- **Apps Incluidas**: Muestra iconos y descripciones de apps incluidas
- **Responsive**: En mobile, los beneficios y apps se muestran dentro del dropdown
- **Markdown Support**: El contenido de detalles soporta formato markdown desde Strapi
- **CTAs Flexibles**: Soporta múltiples botones de llamado a la acción

#### Guía de Uso:
1. **Plan Destacado**: Usa \`isRecommended={true}\` para mostrar el badge de promoción
2. **Detalles Adicionales**: El \`detailsContent\` acepta markdown para información extra en el dropdown
3. **Apps Personalizadas**: Puedes especificar URL de imagen o usar iconos SVG locales
`;

const meta = {
  component: PlanCard,
  title: "Cards/PlanCard",
  tags: ["autodocs"],
  excludeStories: /Data$/,
  parameters: {
    docs: {
      description: {
        component: description
      }
    }
  },
  args: {
    desktopPresentation: "default",
    mobilePresentation: "default"
  },
  argTypes: {
    name: {
      description: "Nombre del plan",
      control: "text",
      table: {
        category: "Display"
      }
    },
    speedValue: {
      description: "Valor de la velocidad",
      control: "text",
      table: {
        category: "Display"
      }
    },
    speedUnit: {
      description: "Unidad de la velocidad (ej: megas, gigas)",
      control: "text",
      table: {
        category: "Display"
      }
    },
    isRecommended: {
      description: "Muestra el badge de plan recomendado",
      control: "boolean",
      table: {
        category: "Display",
        defaultValue: { summary: "false" }
      }
    },
    isRecommendedText: {
      description: "Texto del badge cuando el plan es recomendado",
      control: "text",
      table: {
        category: "Display",
        defaultValue: { summary: "MÁS POPULAR" }
      }
    },
    desktopPresentation: {
      description: "Presentación para viewport desktop",
      control: { type: "select" },
      options: ["default", "trimmed", "pricing", "mobile"],
      table: {
        category: "Display",
        defaultValue: { summary: "default" }
      }
    },
    mobilePresentation: {
      description: "Presentación para viewport mobile",
      control: { type: "select" },
      options: ["default", "accordion"],
      table: {
        category: "Display",
        defaultValue: { summary: "default" }
      }
    },
    mobileAccordionActive: {
      description: "Estado controlado del acordeón mobile",
      control: "boolean",
      table: {
        category: "Display"
      }
    },
    priceInfo: {
      description: "Información de precios del plan",
      control: "object",
      table: {
        category: "Data"
      }
    },
    ctaButtons: {
      description: "Botones de llamado a la acción",
      control: "object",
      table: {
        category: "Actions"
      }
    },
    benefits: {
      description: "Lista de beneficios del plan",
      control: "object",
      table: {
        category: "Data"
      }
    },
    apps: {
      description: "Apps incluidas en el plan",
      control: "object",
      table: {
        category: "Data"
      }
    },
    detailsContent: {
      description:
        "Contenido markdown para detalles adicionales en el dropdown",
      control: "text",
      table: {
        category: "Data"
      }
    },
    className: {
      description:
        "Objeto con clases CSS personalizadas para cada elemento del componente",
      control: "object",
      table: {
        category: "Styles",
        type: {
          summary: "IPlanCardClassName",
          detail: `{
  wrapper?: string;
  topContainer?: string;
  midContainer?: string;
  speedContainer?: string;
  speedText?: string;
  planNameText?: string;
  badge?: string;
  badgeText?: string;
  amountContainer?: string;
  amountText?: string;
  amountImp?: string;
  originalPrice?: string;
  legalDisclaimer?: string;
  btnContainer?: string;
  topBadge?: string;
  benefitsContainer?: string;
  benefitItem?: string;
  benefitIconWrapper?: string;
  benefitText?: string;
  appsLabel?: string;
  appsContainer?: string;
  appItem?: string;
  appImage?: string;
  appName?: string;
  appDescription?: string;
  dropdownContent?: string;
  dropdownContentMobile?: string;
  dropdownDetails?: string;
  divider?: string;
}`
        }
      }
    }
  }
} satisfies Meta<typeof PlanCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "Plan X-Premium",
    speedValue: "700",
    speedUnit: "megas",
    isRecommended: true,
    isRecommendedText: "MÁS POPULAR",
    priceInfo: {
      amount: "$24.00*",
      taxLabel: "+ imp.",
      originalPrice: "$32.00 + imp.",
      legalDisclaimer: "Precio al terminar la promoción: $32.00 (Mes 10)",
      promoLabel: "Precio por 9 meses"
    },
    ctaButtons: [
      {
        label: "Contratar ahora",
        href: "#"
      },
      {
        label: "Contratar por WhatsApp",
        href: "https://wa.me/1234567890",
        type: "noBorder",
        icon: "WhatsappVector"
      }
    ],
    benefits: [
      {
        name: "Instalación gratuita",
        icon: "check_circle"
      },
      {
        name: "GRATIS Mensualidad Diciembre 2025",
        icon: "check_circle"
      }
    ],
    apps: [
      {
        name: "Zapping",
        icon: "Zapping",
        description: "Canales nacionales"
      },
      {
        name: "Paramount+",
        icon: "Paramount",
        description: "Gratuita por 3 meses"
      }
    ],
    detailsContent: `**Otras formas de pago:**
- Pago mensual: $18.99
- A partir del mes 7: $23.50
- Tarjeta de crédito con descuento adicional`,
    className: {
      wrapper: "",
      topContainer: "",
      midContainer: "",
      speedContainer: "",
      speedText: "",
      planNameText: "",
      badge: "",
      badgeText: "",
      amountContainer: "",
      amountText: "",
      amountImp: "",
      originalPrice: "",
      legalDisclaimer: "",
      btnContainer: "",
      topBadge: "",
      benefitsContainer: "",
      benefitItem: "",
      benefitIconWrapper: "",
      benefitText: "",
      appsLabel: "",
      appsContainer: "",
      appItem: "",
      appImage: "",
      appName: "",
      appDescription: "",
      dropdownContent: "",
      dropdownContentMobile: "",
      dropdownDetails: "",
      divider: ""
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo completo de una tarjeta de plan con todos sus elementos."
      }
    }
  }
};

export const WithoutRecommendation: Story = {
  args: {
    name: "Plan X-Basic",
    speedValue: "300",
    speedUnit: "megas",
    isRecommended: false,
    priceInfo: {
      amount: "$18.00*",
      taxLabel: "+ imp.",
      originalPrice: "$25.00 + imp.",
      legalDisclaimer: "Precio al terminar la promoción: $25.00 (Mes 7)",
      promoLabel: "Precio por 6 meses"
    },
    ctaButtons: [
      {
        label: "Contratar ahora",
        href: "#"
        // No especificamos type, será "secondary" porque isRecommended=false
      },
      {
        label: "Contratar por WhatsApp",
        href: "https://wa.me/1234567890",
        type: "noBorder",
        icon: "WhatsappVector"
      }
    ],
    benefits: [
      {
        name: "Instalación incluida",
        icon: "check_circle"
      }
    ],
    apps: [
      {
        name: "Zapping",
        icon: "Zapping",
        description: "Canales básicos"
      }
    ],
    detailsContent: `Consulta por otros planes disponibles en tu zona.`,
    className: {
      wrapper: "",
      topContainer: "",
      midContainer: "",
      speedContainer: "",
      speedText: "",
      planNameText: "",
      badge: "",
      badgeText: "",
      amountContainer: "",
      amountText: "",
      amountImp: "",
      originalPrice: "",
      legalDisclaimer: "",
      btnContainer: "",
      topBadge: "",
      benefitsContainer: "",
      benefitItem: "",
      benefitIconWrapper: "",
      benefitText: "",
      appsLabel: "",
      appsContainer: "",
      appItem: "",
      appImage: "",
      appName: "",
      appDescription: "",
      dropdownContent: "",
      dropdownContentMobile: "",
      dropdownDetails: "",
      divider: ""
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Ejemplo de un plan básico sin badge de recomendación."
      }
    }
  }
};

export const CustomStyles: Story = {
  args: {
    name: "Plan Personalizado",
    speedValue: "500",
    speedUnit: "megas",
    isRecommended: true,
    priceInfo: {
      amount: "$20.00*",
      taxLabel: "+ imp.",
      originalPrice: "$28.00 + imp.",
      legalDisclaimer: "Precio al terminar la promoción: $28.00 (Mes 8)",
      promoLabel: "Precio por 8 meses"
    },
    ctaButtons: [
      {
        label: "Contratar ahora",
        href: "#"
      },
      {
        label: "Contratar por WhatsApp",
        href: "https://wa.me/1234567890",
        type: "noBorder",
        icon: "WhatsappVector"
      }
    ],
    benefits: [
      {
        name: "Instalación gratuita",
        icon: "check_circle"
      }
    ],
    apps: [
      {
        name: "Zapping",
        icon: "Zapping",
        description: "Canales nacionales"
      }
    ],
    detailsContent: `Consulta disponibilidad en tu zona.`,
    className: {
      wrapper: "shadow-2xl",
      topContainer: "bg-gradient-to-br from-purple-50 to-white",
      planNameText: "text-purple-700",
      amountText: "text-purple-600",
      topBadge: "bg-gradient-to-r from-purple-600 to-pink-600",
      badge: "bg-purple-100",
      benefitText: "text-purple-600 font-semibold"
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo de personalización de estilos usando la prop className. Se pueden sobrescribir los estilos de cualquier elemento del componente."
      }
    }
  }
};

export const WithCustomIconFromCms: Story = {
  args: {
    name: "Plan Advance",
    speedValue: "400",
    speedUnit: "megas",
    isRecommended: false,
    priceInfo: {
      amount: "$19.99*",
      taxLabel: "+ imp.",
      originalPrice: "$24.99 + imp.",
      legalDisclaimer: "Precio regular desde el mes 7.",
      promoLabel: "Precio por 6 meses"
    },
    ctaButtons: [
      {
        label: "Contratar ahora",
        href: "#"
      }
    ],
    benefits: [
      {
        name: "Instalacion incluida",
        icon: "check_circle"
      }
    ],
    apps: [
      {
        name: "Liga Ecuabet",
        description: "Incluida en tu plan",
        useCustomIcon: true,
        url: "https://statics.dathaplus.com/assets-admin-xtrim/logo_xtrim_bordes_59b864877e_a23a53b801.png",
        imageAlt: "Logo Liga Ecuabet",
        icon: "sports_soccer"
      },
      {
        name: "Paramount+",
        description: "3 meses sin costo",
        useCustomIcon: false,
        icon: "play_circle"
      }
    ],
    detailsContent: "Ejemplo de app con custom icon URL desde CMS."
  },
  parameters: {
    docs: {
      description: {
        story:
          "Caso de apps con icono proveniente del CMS usando URL y texto alternativo. Si el custom icon llega con isActive=false, el mapper lo excluye y no se renderiza imagen."
      }
    }
  }
};

export const DesktopTrimmed: Story = {
  args: {
    ...Default.args,
    desktopPresentation: "trimmed",
    mobilePresentation: "default"
  }
};

export const Cobertura: Story = {
  args: {
    ...Default.args,
    desktopPresentation: "pricing",
    mobilePresentation: "accordion",
    isRecommended: false,
    apps: [
      {
        name: "Liga Ecuabet",
        description: "Incluida en tu plan",
        useCustomIcon: true,
        url: "https://statics.dathaplus.com/assets-admin-xtrim/logo_xtrim_bordes_59b864877e_a23a53b801.png",
        imageAlt: "Logo Liga Ecuabet"
      }
    ]
  }
};

export const CoberturaRecomendado: Story = {
  args: {
    ...Cobertura.args,
    isRecommended: true,
    isRecommendedText: "Recomendado"
  }
};
