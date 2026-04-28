import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "../../lib/components";

const description = `
### TextField
El componente **TextField** es la unidad fundamental para la captura de texto en formularios. Proporciona una interfaz limpia y accesible para que los usuarios ingresen datos de una sola línea, con un control total sobre la visibilidad de sus etiquetas y estilos.

#### Funcionalidades Clave:
- **Control de Etiquetado**: Mediante la propiedad \`hiddenLabel\`, permite mantener la accesibilidad (para lectores de pantalla) mientras se oculta visualmente el texto del label en diseños compactos.
- **Personalización por Slots**: Utiliza un objeto \`className\` para inyectar estilos específicos en diferentes partes del componente:
  - \`wrapper\`: El contenedor principal que agrupa label e input.
  - \`label\`: Estilos específicos para el texto descriptivo.
  - \`base\`: Clases aplicadas directamente al elemento de entrada de texto.
- **Interacción en Tiempo Real**: Expone el evento \`onChange\` para una integración fluida con manejadores de estado como React Hook Form o Formik.

#### Mejores Prácticas:
1. **Accesibilidad**: Aunque uses \`hiddenLabel: true\`, asegúrate de proveer un texto en \`label\` para que los asistentes de voz identifiquen el propósito del campo.
2. **Contexto**: Usa el \`placeholder\` como una ayuda visual temporal (ej. "098XXXXXXX"), pero nunca como sustituto de una etiqueta clara.
`;

const meta = {
  component: TextField,
  title: "Inputs/TextField",
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
    label: {
      description: "Texto descriptivo del input",
      control: "text",
      table: {
        category: "Display",
        defaultValue: {}
      }
    },
    hiddenLabel: {
      description: "Oculta el label del input",
      control: "boolean",
      table: {
        category: "Display",
        defaultValue: {}
      }
    },
    placeholder: {
      description: "Texto que se muestra cuando el campo está vacío.",
      control: "text",
      table: {
        category: "Display",
        defaultValue: {}
      }
    },
    error: {
      description:
        "Mensaje de error. Activa aria-invalid y vincula el texto mediante aria-describedby.",
      control: "text",
      table: { category: "Accessibility" }
    },
    helperText: {
      description:
        "Texto de soporte que ayuda al usuario a llenar el campo correctamente.",
      control: "text",
      table: { category: "Accessibility" }
    },
    ref: {
      description:
        "Referencia de React vinculada al elemento <input> nativo. Útil para gestionar el foco o integrar con librerías de formularios como React Hook Form.",
      table: {
        category: "Technical",
        type: { summary: "React.Ref<HTMLInputElement>" }
      },
      control: false
    },
    onChange: {
      description:
        "Evento que se dispara cuando el usuario cambia el valor del input.",
      action: "changed",
      control: false,
      table: {
        category: "Events",
        defaultValue: {}
      }
    },
    onFocus: {
      description:
        "Evento que se dispara cuando el usuario hace clic en el botón.",
      action: "focused",
      control: false,
      table: {
        category: "Events",
        defaultValue: {}
      }
    },
    onBlur: {
      description:
        "Evento que se dispara cuando el usuario deja el foco del input.",
      action: "blurred",
      control: false,
      table: {
        category: "Events",
        defaultValue: {}
      }
    },
    className: {
      control: { type: "object" },
      table: {
        category: "Styles",
        defaultValue: {}
      },
      description: "Objeto con la clase base, wrapperLabel y label"
    },
    icon: {
      description: "Nombre del icono de Material Icons que se mostrará a la izquierda del input",
      control: "text",
      table: {
        category: "Display",
        defaultValue: {}
      }
    },
    combobox: {
      description: "Convierte el TextField en un combobox/selector. Añade automáticamente estilos de cursor pointer, readOnly y un icono de flecha",
      control: "boolean",
      table: {
        category: "Display"
      }
    }
  }
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

const argTypes = {
  onChange: { action: "changed" },
  onFocus: { action: "focused" },
  onBlur: { action: "blurred" }
};

export const Default: Story = {
  args: {
    className: { base: "", wrapperLabel: "", label: "" },
    hiddenLabel: false,
    label: "Número de teléfono",
    placeholder: "Ingresa tu número de contacto"
  },
  argTypes,
  parameters: {
    docs: {
      description: {
        story:
          "Configuración base del campo de texto con una etiqueta visible y un placeholder descriptivo."
      }
    }
  }
};

export const HelperText: Story = {
  args: {
    className: { base: "", wrapperLabel: "", label: "" },
    hiddenLabel: false,
    label: "Número de teléfono",
    placeholder: "Ingresa tu número de contacto",
    helperText: "Helper text"
  },
  argTypes,
  parameters: {
    docs: {
      description: {
        story:
          "Incluye un texto de apoyo debajo del campo para proporcionar contexto adicional o instrucciones de formato al usuario."
      }
    }
  }
};

export const Error: Story = {
  args: {
    className: { base: "", wrapperLabel: "", label: "" },
    hiddenLabel: false,
    label: "Número de teléfono",
    placeholder: "Ingresa tu número de contacto",
    error: "Este campo es requerido"
  },
  argTypes,
  parameters: {
    docs: {
      description: {
        story:
          "Muestra el estado de validación fallida. El mensaje de error cambia el color del borde y utiliza atributos ARIA para notificar a lectores de pantalla."
      }
    }
  }
};

export const Disabled: Story = {
  args: {
    className: { base: "", wrapperLabel: "", label: "" },
    hiddenLabel: false,
    label: "Número de teléfono",
    placeholder: "Ingresa tu número de contacto",
    disabled: true
  },
  argTypes,
  parameters: {
    docs: {
      description: {
        story:
          "Estado de solo lectura que bloquea la interacción del usuario, reduciendo la opacidad visual para indicar que el campo no está disponible."
      }
    }
  }
};

export const WithIcon: Story = {
  args: {
    className: { base: "", wrapperLabel: "", label: "" },
    hiddenLabel: false,
    label: "Correo electrónico",
    placeholder: "ejemplo@correo.com",
    icon: "email"
  },
  argTypes,
  parameters: {
    docs: {
      description: {
        story:
          "Campo de texto con un icono de Material Icons a la izquierda. El icono se posiciona automáticamente y el padding del input se ajusta para dar espacio al icono. Puedes usar cualquier nombre de icono disponible en Material Icons."
      }
    }
  }
};

export const WithIconAndError: Story = {
  args: {
    className: { base: "", wrapperLabel: "", label: "" },
    hiddenLabel: false,
    label: "Número de teléfono",
    placeholder: "Ingresa tu número",
    icon: "phone",
    error: "Formato de teléfono inválido"
  },
  argTypes,
  parameters: {
    docs: {
      description: {
        story:
          "Combinación de icono con estado de error. El icono mantiene su posición mientras el borde y el mensaje de error indican la validación fallida"
      }
    }
  }
};

export const Combobox: Story = {
  args: {
    className: { base: "", wrapperLabel: "", label: "" },
    hiddenLabel: false,
    label: "Ciudad",
    placeholder: "Selecciona una ciudad",
    combobox: true,
    options: [
      { value: "quito", label: "Quito" },
      { value: "guayaquil", label: "Guayaquil" },
      { value: "cuenca", label: "Cuenca" },
      { value: "manta", label: "Manta" }
    ],
    value: "",
    searchable: false
  },
  argTypes: {
    ...argTypes,
    onSelectOption: { action: "selected" }
  },
  parameters: {
    docs: {
      description: {
        story:
          "TextField con variante combobox completamente funcional. Incluye dropdown con opciones, selección automática, y cierre al hacer clic fuera. Usa las props 'options', 'value', 'onSelect' para manejar la selección."
      }
    }
  }
};

export const ComboboxSearchable: Story = {
  args: {
    className: { base: "", wrapperLabel: "", label: "" },
    hiddenLabel: false,
    label: "Ciudad",
    placeholder: "Busca o selecciona",
    combobox: true,
    options: [
      { value: "quito", label: "Quito" },
      { value: "guayaquil", label: "Guayaquil" },
      { value: "cuenca", label: "Cuenca" },
      { value: "manta", label: "Manta" },
      { value: "loja", label: "Loja" },
      { value: "ambato", label: "Ambato" },
      { value: "riobamba", label: "Riobamba" },
      { value: "esmeraldas", label: "Esmeraldas" }
    ],
    value: "",
    searchable: true
  },
  argTypes: {
    ...argTypes,
    onSelectOption: { action: "selected" }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Combobox con búsqueda habilitada. Incluye un campo de búsqueda en el dropdown para filtrar opciones en tiempo real."
      }
    }
  }
};

export const ComboboxWithIcon: Story = {
  args: {
    className: { base: "", wrapperLabel: "", label: "" },
    hiddenLabel: false,
    label: "Provincia",
    placeholder: "Selecciona tu provincia",
    icon: "location_on",
    combobox: true,
    options: [
      { value: "pichincha", label: "Pichincha" },
      { value: "guayas", label: "Guayas" },
      { value: "azuay", label: "Azuay" },
      { value: "manabi", label: "Manabí" },
      { value: "el-oro", label: "El Oro" }
    ],
    value: "",
    searchable: false
  },
  argTypes: {
    ...argTypes,
    onSelectOption: { action: "selected" }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Combobox con icono a la izquierda. Combina el icono del TextField con la funcionalidad del dropdown."
      }
    }
  }
};

export const ComboboxWithValue: Story = {
  args: {
    className: { base: "", wrapperLabel: "", label: "" },
    hiddenLabel: false,
    label: "Ciudad",
    placeholder: "Selecciona una ciudad",
    combobox: true,
    options: [
      { value: "quito", label: "Quito" },
      { value: "guayaquil", label: "Guayaquil" },
      { value: "cuenca", label: "Cuenca" },
      { value: "manta", label: "Manta" }
    ],
    value: "quito",
    searchable: false
  },
  argTypes: {
    ...argTypes,
    onSelectOption: { action: "selected" }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Combobox con valor pre-seleccionado. El campo muestra automáticamente el label de la opción seleccionada."
      }
    }
  }
};

export const ComboboxWithError: Story = {
  args: {
    className: { base: "", wrapperLabel: "", label: "" },
    hiddenLabel: false,
    label: "Ciudad",
    placeholder: "Selecciona una ciudad",
    combobox: true,
    options: [
      { value: "quito", label: "Quito" },
      { value: "guayaquil", label: "Guayaquil" },
      { value: "cuenca", label: "Cuenca" }
    ],
    value: "",
    error: "Este campo es requerido",
    searchable: false
  },
  argTypes: {
    ...argTypes,
    onSelectOption: { action: "selected" }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Combobox con mensaje de error. Muestra validación fallida con borde rojo y mensaje de error."
      }
    }
  }
};

export const ComboboxWithDisabledOptions: Story = {
  args: {
    className: { base: "", wrapperLabel: "", label: "" },
    hiddenLabel: false,
    label: "Plan",
    placeholder: "Selecciona un plan",
    combobox: true,
    options: [
      { value: "basic", label: "Plan Básico" },
      { value: "standard", label: "Plan Estándar" },
      { value: "premium", label: "Plan Premium", disabled: true },
      { value: "enterprise", label: "Plan Empresarial", disabled: true }
    ],
    value: "",
    searchable: false
  },
  argTypes: {
    ...argTypes,
    onSelectOption: { action: "selected" }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Combobox con opciones deshabilitadas. Las opciones disabled se muestran con opacidad reducida y no son seleccionables."
      }
    }
  }
};

export const ComboboxWithHelperText: Story = {
  args: {
    className: { base: "", wrapperLabel: "", label: "" },
    hiddenLabel: false,
    label: "País",
    placeholder: "Selecciona tu país",
    helperText: "Selecciona el país donde resides actualmente",
    combobox: true,
    options: [
      { value: "ec", label: "Ecuador" },
      { value: "co", label: "Colombia" },
      { value: "pe", label: "Perú" },
      { value: "ve", label: "Venezuela" },
      { value: "bo", label: "Bolivia" }
    ],
    value: "",
    searchable: false
  },
  argTypes: {
    ...argTypes,
    onSelectOption: { action: "selected" }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Combobox con texto de ayuda. Proporciona contexto adicional debajo del campo."
      }
    }
  }
};

export const ComboboxLongList: Story = {
  args: {
    className: { base: "", wrapperLabel: "", label: "" },
    hiddenLabel: false,
    label: "Ciudad",
    placeholder: "Busca tu ciudad",
    combobox: true,
    options: [
      { value: "quito", label: "Quito" },
      { value: "guayaquil", label: "Guayaquil" },
      { value: "cuenca", label: "Cuenca" },
      { value: "santo-domingo", label: "Santo Domingo" },
      { value: "machala", label: "Machala" },
      { value: "manta", label: "Manta" },
      { value: "portoviejo", label: "Portoviejo" },
      { value: "loja", label: "Loja" },
      { value: "ambato", label: "Ambato" },
      { value: "esmeraldas", label: "Esmeraldas" },
      { value: "riobamba", label: "Riobamba" },
      { value: "ibarra", label: "Ibarra" },
      { value: "quevedo", label: "Quevedo" },
      { value: "milagro", label: "Milagro" },
      { value: "babahoyo", label: "Babahoyo" }
    ],
    value: "",
    searchable: true
  },
  argTypes: {
    ...argTypes,
    onSelectOption: { action: "selected" }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Combobox con lista larga de opciones. El dropdown tiene scroll y la búsqueda es esencial para encontrar opciones rápidamente."
      }
    }
  }
};


