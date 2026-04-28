import type { Meta, StoryObj } from "@storybook/react-vite";
import { Footer } from "../../lib/components";

import fbImg from "../../assets/svg/socialMedia/facebook.svg";
import instagramImg from "../../assets/svg/socialMedia/instagram.svg";
import linkedinImg from "../../assets/svg/socialMedia/linkedIn.svg";
import youtubeImg from "../../assets/svg/socialMedia/youTube.svg";

const description = `
El componente **Footer** es el cierre estructural de la aplicación. Está diseñado bajo una arquitectura modular que permite gestionar múltiples columnas de enlaces, redes sociales e información corporativa.

### Características:
- **Secciones Flexibles**: Soporta múltiples grupos de enlaces con títulos personalizados.
- **Acceso Regulatorio**: Incluye lógica para mostrar botones destacados de información legal/regulatoria.
- **Redes Sociales**: Mapeo dinámico de iconos y enlaces con seguridad \`noopener\`.
- **Información Extra**: Slots dedicados para dirección física y horarios de atención.
- **Inyección de Componentes**: Compatible con componentes de enrutamiento externos (como \`next/link\`) mediante la prop \`linkComponent\`.
`;

const meta = {
  component: Footer,
  title: "Menu/Footer",
  tags: ["autodocs"],
  excludeStories: /Data$/,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: description
      }
    }
  },
  argTypes: {
    className: { table: { disable: true } },
    logo: {
      description: "Objeto que contiene la configuración del logo y su enlace de redirección.",
      control: "object",
      table: { category: "Brand" }
    },
    info: {
      description: "Información de contacto corporativa (dirección y horarios).",
      control: "object",
      table: { category: "Corporate Info" }
    },
    socialNetworks: {
      description: "Listado de redes sociales con sus iconos y links.",
      control: "object",
      table: { category: "Social" }
    },
    links: {
      description: "Array de secciones que contienen los grupos de enlaces del footer.",
      control: "object",
      table: { category: "Navigation" }
    },
    linkRegulatorios: {
      description: "Configuración del enlace destacado para entes reguladores.",
      control: "object",
      table: { category: "Legal" }
    },
    linkPolicies: {
      description: "Configuración del enlace para políticas de privacidad.",
      control: "object",
      table: { category: "Legal" }
    },
    linkComponent: {
      description: "Componente personalizado para manejar la navegación (ej. Link de Next.js o React Router).",
      table: { category: "Behavior" }
    },
    footerVariant: {
      description: "Variante de visualización del footer. Permite controlar qué elementos se muestran.",
      control: { type: "select" },
      options: ["default", "no_items", "simple", "none"],
      table: { category: "Behavior" }
    }
  }
} satisfies Meta<unknown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    footerVariant: "default",
    info: {
      items: [
        {
          label: "Dirección",
          content: "Av. Eloy Alfaro y la que cruza."
        },
        {
          label: "Horario de atención",
          content: "Lunes a Viernes de 8:00 a 18:00"
        }
      ]
    },
    socialNetworks: [
      {
        img: { src: fbImg as unknown as string },
        link: { href: "https://www.facebook.com/xtrim.ec", target: "_blank", rel: "noopener" }
      },
      {
        img: { src: instagramImg as unknown as string },
        link: { href: "https://www.instagram.com/xtrim.ec", target: "_blank", rel: "noopener" }
      },
      {
        img: { src: linkedinImg as unknown as string },
        link: { href: "https://www.linkedin.com/company/xtrim-ec/", target: "_blank", rel: "noopener" }
      },
      {
        img: { src: youtubeImg as unknown as string },
        link: { href: "https://www.youtube.com/channel/EC-8-0-v7-5-6-9", target: "_blank", rel: "noopener" }
      }
    ],
    links: [
      {
        title: "Servicios",
        link: [
          { href: "#", label: "Planes para el hogar" },
          { href: "#", label: "Planes para empresas" },
          { href: "#", label: "Planes Fibra Óptica" },
          { href: "#", label: "Planes Conexión Hibrida" },
          { href: "#", label: "Soporte" },
          { href: "#", label: "Preguntas frecuentes" }
        ]
      },
      {
        title: "Información legal",
        link: [
          { href: "#", label: "Información pública" },
          { href: "#", label: "Contrato de prestación de servicios" },
          { href: "#", label: "Derechos del usuario" },
          { href: "#", label: "Atención al Cliente" },
          { href: "#", label: "Facturación electrónica" }
        ]
      },
      {
        title: "Recursos",
        link: [
          { href: "#", label: "Blog / Noticias" },
          { href: "#", label: "Cómo configurar tu Wi-Fi" },
          { href: "#", label: "Test de velocidad" },
          { href: "#", label: "Mapa de cobertura" }
        ]
      }
    ],
    linkRegulatorios: {
      href: "#",
      label: "Regulaciones legales"
    },
    linkPolicies: {
      href: "#",
      label: "Política de privacidad de datos personales"
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Configuración completa del footer con tres columnas de navegación, redes sociales y links legales."
      }
    }
  }
};

export const Simple: Story = {
  args: {
    footerVariant: "simple"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Variante simplificada: solo muestra el logo centrado con fondo primario. Ideal para flujos guiados como el flujo semiautomático."
      }
    }
  }
};

export const NoItems: Story = {
  args: {
    footerVariant: "no_items",
    linkPolicies: {
      href: "#",
      label: "Política de privacidad de datos personales"
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Variante mínima: muestra únicamente el separador horizontal y el copyright/políticas, sin logo, redes sociales ni links de navegación."
      }
    }
  }
};

export const None: Story = {
  args: {
    footerVariant: "none"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Variante sin footer: no renderiza ningún elemento. Útil cuando la página requiere un pie de página completamente personalizado o ninguno."
      }
    }
  }
};

