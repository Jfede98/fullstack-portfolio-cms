import type { Meta, StoryObj } from "@storybook/react-vite";
import { MapComponent } from "../../lib/components/mapComponent";

const description = `
**MapComponent** renderiza un mapa interactivo usando **Mapbox GL JS** (vía \`react-map-gl\`) o **Google Maps** (vía \`@react-google-maps/api\`).

### Props principales
- \`provider\`: selecciona el proveedor de mapa (\`"mapbox"\` o \`"google"\`).
- \`token\`: token de autenticación del proveedor seleccionado (Mapbox access token o Google Maps API key).
- \`longitude\` / \`latitude\`: centro inicial del mapa (opcional — si se omiten muestra Ecuador completo).
- \`zoom\`: nivel de zoom inicial (solo aplica cuando hay centro explícito).
- \`mapStyle\`: estilo de Mapbox (URL \`mapbox://styles/...\`). Solo aplica a Mapbox.
- \`markers\`: array de marcadores con \`{ longitude, latitude, color, title }\`
`;

// @ts-ignore
const MAPBOX_TOKEN = import.meta.env.STORYBOOK_MAPBOX_TOKEN ?? "";
// @ts-ignore
const GOOGLE_TOKEN = import.meta.env.STORYBOOK_GOOGLE_TOKEN ?? "";

const meta = {
  component: MapComponent,
  title: "Utilities/Map",
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
    provider: {
      control: "select",
      options: ["mapbox", "google"],
      description: "Proveedor del mapa"
    },
    token: {
      control: "text",
      description: "Token del proveedor: Mapbox access token o Google Maps API key"
    },
    longitude: {
      control: { type: "number", step: 0.001 },
      description: "Longitud del centro inicial (opcional — si se omite junto con latitude, muestra el Ecuador completo)"
    },
    latitude: {
      control: { type: "number", step: 0.001 },
      description: "Latitud del centro inicial (opcional — si se omite junto con longitude, muestra el Ecuador completo)"
    },
    zoom: {
      control: { type: "number", min: 1, max: 22, step: 0.5 },
      description: "Nivel de zoom inicial (solo aplica cuando hay longitude y latitude explícitos)"
    },
    mapStyle: {
      control: "select",
      options: [
        "mapbox://styles/mapbox/streets-v12",
        "mapbox://styles/mapbox/outdoors-v12",
        "mapbox://styles/mapbox/light-v11",
        "mapbox://styles/mapbox/dark-v11",
        "mapbox://styles/mapbox/satellite-v9",
        "mapbox://styles/mapbox/satellite-streets-v12"
      ],
      description: "Estilo del mapa de Mapbox (solo aplica a provider='mapbox')"
    },
    markers: {
      control: "object",
      description: "Array de marcadores a mostrar en el mapa"
    }
  }
} satisfies Meta<typeof MapComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Mapbox stories ───────────────────────────────────────────────────────────

export const Default: Story = {
  args: { provider: "mapbox", token: MAPBOX_TOKEN },
  parameters: { docs: { description: { story: "Vista por defecto: muestra **todo el Ecuador** usando `fitBounds`." } } }
};

export const CentradoEnQuito: Story = {
  args: { provider: "mapbox", token: MAPBOX_TOKEN, longitude: -78.5123, latitude: -0.2201, zoom: 13 },
  parameters: { docs: { description: { story: "Mapa centrado en **Quito** con `longitude`, `latitude` y `zoom` explícitos." } } }
};

export const ConMarcadores: Story = {
  args: {
    provider: "mapbox",
    token: MAPBOX_TOKEN,
    markers: [
      { longitude: -78.5123, latitude: -0.2201, color: "#FF0000", title: "Quito — Plaza Grande" },
      { longitude: -79.8891, latitude: -2.1710, color: "#0055FF", title: "Guayaquil — Malecón 2000" },
      { longitude: -79.2042, latitude: 0.3517,  color: "#00AA44", title: "Ibarra — Parque Pedro Moncayo" },
      { longitude: -79.2042, latitude: -3.9931, color: "#FF8C00", title: "Loja — Plaza Central" }
    ]
  },
  parameters: { docs: { description: { story: "Marcadores en varias ciudades. Sin centro explícito → `fitBounds` automático." } } }
};

export const MarcadorUnico: Story = {
  args: {
    provider: "mapbox",
    token: MAPBOX_TOKEN,
    markers: [{ longitude: -79.8891, latitude: -2.1710, color: "#E91E63", title: "Guayaquil — Malecón 2000" }]
  },
  parameters: { docs: { description: { story: "Un solo marcador en **Guayaquil**." } } }
};

export const EstiloOscuro: Story = {
  args: {
    provider: "mapbox",
    token: MAPBOX_TOKEN,
    longitude: -78.5123, latitude: -0.2201, zoom: 13,
    mapStyle: "mapbox://styles/mapbox/dark-v11",
    markers: [{ longitude: -78.5123, latitude: -0.2201, color: "#00D9FF", title: "Quito — Plaza Grande" }]
  },
  parameters: { docs: { description: { story: "Estilo oscuro de Mapbox centrado en Quito." } } }
};

export const EstiloSatelite: Story = {
  args: {
    provider: "mapbox",
    token: MAPBOX_TOKEN,
    longitude: -78.5123, latitude: -0.2201, zoom: 14,
    mapStyle: "mapbox://styles/mapbox/satellite-streets-v12"
  },
  parameters: { docs: { description: { story: "Vista satelital con calles, centrada en Quito con zoom 14." } } }
};

export const EcuadorSatelite: Story = {
  args: {
    provider: "mapbox",
    token: MAPBOX_TOKEN,
    mapStyle: "mapbox://styles/mapbox/satellite-streets-v12"
  },
  parameters: { docs: { description: { story: "Ecuador completo en **vista satelital**." } } }
};

export const SinToken: Story = {
  args: { provider: "mapbox", token: "" },
  parameters: { docs: { description: { story: "Sin `token` → el componente muestra un mensaje de advertencia." } } }
};

// ─── Google Maps stories ──────────────────────────────────────────────────────

export const GoogleDefault: Story = {
  args: { provider: "google", token: GOOGLE_TOKEN },
  parameters: { docs: { description: { story: "Vista por defecto de **Google Maps**: Ecuador completo." } } }
};

export const GoogleCentradoEnQuito: Story = {
  args: { provider: "google", token: GOOGLE_TOKEN, longitude: -78.5123, latitude: -0.2201, zoom: 13 },
  parameters: { docs: { description: { story: "Google Maps centrado en **Quito**." } } }
};

export const GoogleConMarcadores: Story = {
  args: {
    provider: "google",
    token: GOOGLE_TOKEN,
    markers: [
      { longitude: -78.5123, latitude: -0.2201, title: "Quito — Plaza Grande" },
      { longitude: -79.8891, latitude: -2.1710, title: "Guayaquil — Malecón 2000" },
      { longitude: -79.2042, latitude: 0.3517,  title: "Ibarra — Parque Pedro Moncayo" },
      { longitude: -79.2042, latitude: -3.9931, title: "Loja — Plaza Central" }
    ]
  },
  parameters: { docs: { description: { story: "Google Maps con marcadores en varias ciudades. Sin centro explícito → `fitBounds` automático." } } }
};

export const GoogleMarcadorUnico: Story = {
  args: {
    provider: "google",
    token: GOOGLE_TOKEN,
    markers: [{ longitude: -79.8891, latitude: -2.1710, title: "Guayaquil — Malecón 2000" }]
  },
  parameters: { docs: { description: { story: "Un solo marcador en **Guayaquil** con Google Maps." } } }
};

export const GoogleSinToken: Story = {
  args: { provider: "google", token: "" },
  parameters: { docs: { description: { story: "Sin `token` → el componente muestra un mensaje de advertencia." } } }
};
