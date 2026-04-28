import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { CheckboxCustom } from "../../lib/components";

const ErrorInteractiveView = (
  args: React.ComponentProps<typeof CheckboxCustom>
) => {
  const [checked, setChecked] = useState(false);

  return (
    <CheckboxCustom
      {...args}
      checked={checked}
      onChange={(event) => setChecked(event.target.checked)}
      errorMessage={checked ? undefined : args.errorMessage}
    />
  );
};

const meta = {
  component: CheckboxCustom,
  title: "Inputs/CheckboxCustom",
  tags: ["autodocs"],
  argTypes: {
    label: {
      description: "Texto en Markdown que acompana al checkbox.",
      control: "text",
      table: {
        category: "Display",
        defaultValue: {}
      }
    },
    name: {
      description: "Identificador unico para el input.",
      control: "text",
      table: {
        category: "Technical",
        defaultValue: {}
      }
    },
    required: {
      description: "Marca el campo como requerido.",
      control: "boolean",
      table: {
        category: "Validation",
        defaultValue: {}
      }
    },
    errorMessage: {
      description: "Mensaje de error debajo del checkbox.",
      control: "text",
      table: {
        category: "Validation",
        defaultValue: {}
      }
    },
    disabled: {
      description: "Deshabilita la interaccion del checkbox.",
      control: "boolean",
      table: {
        category: "State",
        defaultValue: {}
      }
    },
    onChange: {
      action: "changed",
      control: false,
      table: {
        category: "Events",
        defaultValue: {}
      }
    }
  }
} satisfies Meta<typeof CheckboxCustom>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "legal-consent",
    required: true,
    label:
      "Al dar clic, autorizas el uso y tratamiento de tus datos personales conforme a la política de Xtrim"
  }
};

export const ErrorState: Story = {
  args: {
    name: "legal-consent",
    required: true,
    label:
      "Al dar clic, autorizas el uso y tratamiento de tus datos personales conforme a la política de Xtrim",
    errorMessage: "Debes aceptar para continuar"
  }
};

export const ErrorInteractive: Story = {
  args: {
    name: "legal-consent",
    required: true,
    label:
      "Al dar clic, autorizas el uso y tratamiento de tus datos personales conforme a la política de Xtrim",
    errorMessage: "Debes aceptar para continuar"
  },
  render: (args) => <ErrorInteractiveView {...args} />
};
