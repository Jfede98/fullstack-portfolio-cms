import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Benefits,
  Button,
  Icon,
  TextField,
  TwoColumns,
  Typography
} from "../../lib/components";

const LeftColumn = () => (
  <Benefits
    layout="vertical"
    title={{ text: "¿Por qué elegir Xtrim?", tag: "h2" }}
    benefits={[
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
    ]}
    className={{
      base: "py-0! px-0! gap-10",
      titleStyle: "text-left",
      benefitsContainerStyle: "w-full gap-4",
      benefitItemStyle: "px-6 py-4 gap-6",
      benefitContentStyle: "gap-2",
      benefitsDescriptionStyle: "hidden"
    }}
  />
);

const RightColumn = () => (
  <div className="w-full rounded-2xl border-4 border-white/40 bg-white p-8 shadow-[0_4px_16px_rgba(0,0,0,0.1)] lg:max-w-124">
    <div className="mb-4 flex items-start gap-4">
      <Icon
        name="contact_phone"
        type="outlined"
        size="xl"
        color="text-primary-900"
      />
      <div className="flex flex-col">
        <Typography tag="h3" variant="h3" type="regular">
          Solicita información
        </Typography>
        <Typography
          tag="p"
          variant="caption"
          type="regular"
          className={{ base: "text-gray-400" }}
        >
          Un asesor Xtrim se comunicará contigo
        </Typography>
      </div>
    </div>

    <div className="flex flex-col gap-4">
      <TextField
        label="Nombre completo"
        placeholder="Escribe tus nombres completos"
        icon="person"
      />
      <TextField
        label="Número de teléfono"
        placeholder="Ingresa tu número de contacto"
        icon="phone_android"
      />
      <TextField
        label="Número de cédula"
        placeholder="Ingresa tu cédula"
        icon="assignment_ind"
      />
      <Button className={{ base: "w-full" }}>Enviar</Button>
    </div>
  </div>
);

const meta = {
  title: "Layout/TwoColumns",
  component: TwoColumns,
  tags: ["autodocs"],
  argTypes: {
    left: {
      control: false,
      table: {
        disable: true
      }
    },
    right: {
      control: false,
      table: {
        disable: true
      }
    },
    background: {
      control: { type: "select" },
      options: ["primary-50", "white"],
      description: "Token de fondo para el layout de dos columnas."
    },
    showDivider: {
      control: { type: "boolean" },
      description: "Muestra una línea divisoria entre las dos columnas."
    },
    dividerColor: {
      control: { type: "color" },
      description: "Color de la línea divisoria."
    },
    leftWidth: {
      control: { type: "text" },
      description:
        "Ancho de la columna izquierda en desktop (ej: 30%, 360px, 24rem).",
      table: {
        type: { summary: "string" }
      }
    },
    rightWidth: {
      control: { type: "text" },
      description:
        "Ancho de la columna derecha en desktop (ej: 40%, 420px, 28rem).",
      table: {
        type: { summary: "string" }
      }
    }
  },
  args: {
    background: "primary-50",
    showDivider: false,
    dividerColor: "#B7B7B9",
    left: null,
    right: null
  },
  render: (args) => (
    <TwoColumns {...args} left={<LeftColumn />} right={<RightColumn />} />
  ),
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Componente reusable para renderizar dos columnas (stack en mobile, side-by-side en desktop)."
      }
    }
  }
} satisfies Meta<typeof TwoColumns>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    background: "primary-50"
  }
};

export const WhiteBackground: Story = {
  args: {
    background: "white"
  }
};

export const CustomDistribution: Story = {
  args: {
    background: "primary-50",
    showDivider: true,
    dividerColor: "#B7B7B9",
    leftWidth: "30%",
    rightWidth: "40%"
  }
};
