import type { Meta, StoryObj } from "@storybook/react-vite";
import { AttentionCenterCard } from "../../lib/components/cards/attentionCenter";

const description = `
**AttentionCenterCard** es un componente de tarjeta diseñado específicamente para mostrar información de centros de atención y kioscos.

### Características principales
- **Imagen**: Imagen representativa del centro/kiosco
- **Título**: Nombre del centro con color corporativo (#6E3279)
- **Dirección**: Con icono de ubicación
- **Horario**: Con icono de reloj
- **Botones de acción**: Para ver en mapa y mostrar servicios
- **Coordenadas**: Para integración con mapas
- **Tipo de servicio**: Centro de experiencia o Kiosco
`;

const meta = {
  component: AttentionCenterCard,
  title: "Cards/AttentionCenter",
  tags: ["autodocs"],
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
      control: "text",
      description: "Nombre del centro de atención"
    },
    address: {
      control: "text", 
      description: "Dirección del centro"
    },
    schedule: {
      control: "text",
      description: "Horario de atención"
    },
    serviceType: {
      control: "select",
      options: ["centro_experiencia", "kiosco"],
      description: "Tipo de servicio"
    },
    services: {
      control: "object",
      description: "Lista de servicios disponibles"
    },
    latitude: {
      control: { type: "number", step: 0.0001 },
      description: "Latitud para ubicación en mapa"
    },
    longitude: {
      control: { type: "number", step: 0.0001 },
      description: "Longitud para ubicación en mapa"
    }
  }
} satisfies Meta<typeof AttentionCenterCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs = {
  title: "Centro de Experiencia Quito Norte",
  image: {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    alt: "Centro de experiencia"
  },
  city: "Quito",
  address: "Av. Amazonas N24-03 y Colón, Edificio España, Planta Baja",
  schedule: "Lunes a Viernes: 8:00 AM - 6:00 PM\nSábados: 9:00 AM - 2:00 PM",
  latitude: -0.2201,
  longitude: -78.5123,
  serviceType: "centro_experiencia" as const,
  services: [
    "Activación de servicios",
    "Soporte técnico",
    "Cambio de planes",
    "Facturación",
    "Reclamos"
  ],
  mapButton: {
    children: "Ver en mapa",
    color: "primary" as const,
    typeStyle: "square" as const
  },
  servicesButton: {
    children: "Ver servicios",
    color: "outline" as const,
    typeStyle: "square" as const
  }
};

export const Default: Story = {
  args: defaultArgs,
  parameters: {
    docs: {
      description: {
        story: "Tarjeta básica de centro de experiencia con todos los elementos."
      }
    }
  }
};

export const Kiosco: Story = {
  args: {
    ...defaultArgs,
    title: "Isla Mall El Jardín",
    serviceType: "isla",
    city: "Quito",
    address: "Mall El Jardín, Planta Baja, Local 105",
    schedule: "Lunes a Domingo: 10:00 AM - 9:00 PM",
    services: [
      "Pagos",
      "Consultas básicas",
      "Activación SIM"
    ],
    image: {
      src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      alt: "Isla"
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Ejemplo de isla con servicios más limitados."
      }
    }
  }
};

export const CentroGuayaquil: Story = {
  args: {
    ...defaultArgs,
    title: "Centro de Experiencia Guayaquil",
    city: "Guayaquil",
    address: "Av. 9 de Octubre 100 y Malecón, Torre Banco del Pacífico",
    latitude: -2.1710,
    longitude: -79.8891,
    image: {
      src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
      alt: "Centro Guayaquil"
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Centro de experiencia en Guayaquil con coordenadas diferentes."
      }
    }
  }
};

export const ConFuncionalidad: Story = {
  args: {
    ...defaultArgs,
    onMapClick: (lat, lng) => {
      alert(`Centrar mapa en: ${lat}, ${lng}`);
    },
    onServicesClick: (services) => {
      alert(`Servicios: ${services.join(", ")}`);
    }
  },
  parameters: {
    docs: {
      description: {
        story: "Ejemplo con callbacks funcionales para los botones."
      }
    }
  }
};