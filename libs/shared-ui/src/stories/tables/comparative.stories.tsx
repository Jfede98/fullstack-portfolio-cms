import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComparativeTable } from "../../lib/components";
import { Screen } from "../../lib/constants/state";

const description = `
Es un componente robusto diseñado para facilitar la **comparación visual de planes o servicios**. 

#### Características principales:
- **Estructura clara:** Permite listar características (rows) contra diferentes ofertas (columns).
- **Control de estados:** Utiliza un array de booleanos (\`active\`) para determinar qué característica incluye cada plan.
- **Responsivo:** Se adapta automáticamente a dispositivos móviles mediante el uso de pestañas (tabs) o sliders basados en el \`matchMediaBreakpoint\`.
- **Acciones directas:** Cada sección de plan soporta múltiples botones de acción (CTA).
`;

const meta = {
  component: ComparativeTable,
  title: "Table/ComparativeTable",
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
    matchMediaBreakpoint: {
      control: "select",
      description:
        "Define el punto de quiebre (Screen) donde la tabla cambia a su versión móvil.",
      table: {
        category: "Responsive"
      }
    },
    titleTable: {
      control: "object",
      description:
        "Propiedades de tipografía para el encabezado de la primera columna de la tabla comparativa (versión escritorio). Acepta todas las props de Typography (tag, variant, type, children, etc.). Por defecto renderiza \"Plan\" con variant h2.",
      table: {
        category: "Content"
      }
    },
    comparative: {
      description:
        "Array de objetos que definen las filas (etiquetas y descripción de características)."
    },
    sections: {
      description:
        "Define las columnas de la tabla (planes), sus precios y qué características están activas."
    }
  }
} satisfies Meta<typeof ComparativeTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    titleTable: { tag: "span", variant: "h2", type: "regular", children: "Plan" },
    title: {
      tag: "h2",
      type: "regular",
      variant: "h2",
      children: "Compara nuestros planes"
    },
    subtitle: {
      tag: "h3",
      type: "regular",
      variant: "body",
      children: "La conexión más rápida y estable para tu hogar"
    },
    matchMediaBreakpoint: Screen.lg,
    comparative: [
      {
        label: "Instalación",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing."
      },
      {
        label: "Soporte 24/7",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing."
      },
      {
        label: "5+ dispositivos conectados",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing."
      },
      {
        label: "Zapping",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing."
      },
      {
        label: "Zapping + Liga Pro",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing."
      },
      {
        label: "Paramount +",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing."
      },
      {
        label: "HBOmax",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing."
      }
    ],
    sections: [
      {
        label: "Plan 400 mb",
        active: [true, true, true, false, false, false, false],
        plan: {
          prevPrice: 19.99,
          price: 17.99,
          buttons: [
            {
              children: "Contratar Plan 400 mb",
              type: "button",
              color: "secondary"
            },
            {
              children: "Solicitar por WhatsApp",
              type: "link",
              href: "https://google.com.ec",
              target: "_blank",
              color: "noBorder"
            }
          ]
        }
      },
      {
        label: "Plan 700 mb",
        active: [true, true, true, true, true, false, false],
        plan: {
          prevPrice: 19.99,
          price: 17.99,
          buttons: [
            {
              children: "Contratar Plan 700 mb",
              type: "button",
              color: "primary"
            },
            {
              children: "Solicitar por WhatsApp",
              type: "link",
              href: "https://google.com.ec",
              target: "_blank",
              color: "outline"
            }
          ]
        }
      },
      {
        label: "Plan 1000 mb",
        active: [true, true, true, true, true, true, true],
        plan: {
          prevPrice: 19.99,
          price: 17.99,
          buttons: [
            {
              children: "Contratar Plan 1000 mb",
              type: "button",
              color: "primary"
            },
            {
              children: "Solicitar por WhatsApp",
              type: "link",
              href: "https://google.com.ec",
              target: "_blank",
              color: "outline"
            }
          ]
        }
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: `
**Vista por defecto:** En pantallas grandes (\`Screen.lg\`), el componente muestra todas las comparativas en una cuadrícula. 
Cada plan incluye su precio actual, precio anterior y botones de acción personalizados. 
Las marcas de verificación o disponibilidad se gestionan mediante el mapeo del array \`active\` contra el array \`comparative\`.
`
      }
    }
  }
};

export const WithSixPlans: Story = {
  args: {
    titleTable: { tag: "span", variant: "h2", type: "regular", children: "Plan" },
    title: {
      tag: "h2",
      type: "regular",
      variant: "h2",
      children: "Compara todos nuestros planes"
    },
    subtitle: {
      tag: "h3",
      type: "regular",
      variant: "body",
      children: "Encuentra el plan perfecto para tus necesidades"
    },
    matchMediaBreakpoint: Screen.lg,
    comparative: [
      {
        label: "Instalación",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing."
      },
      {
        label: "Soporte 24/7",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing."
      },
      {
        label: "5+ dispositivos conectados",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing."
      },
      {
        label: "Zapping",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing."
      },
      {
        label: "Zapping + Liga Pro",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing."
      },
      {
        label: "Paramount +",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing."
      },
      {
        label: "HBOmax",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing."
      }
    ],
    sections: [
      {
        label: "Plan 200 mb",
        active: [true, false, false, false, false, false, false],
        plan: {
          prevPrice: 14.99,
          price: 12.99,
          buttons: [
            {
              children: "Contratar Plan 200 mb",
              type: "button",
              color: "secondary"
            },
            {
              children: "Solicitar por WhatsApp",
              type: "link",
              href: "https://google.com.ec",
              target: "_blank",
              color: "noBorder"
            }
          ]
        }
      },
      {
        label: "Plan 400 mb",
        active: [true, true, true, false, false, false, false],
        plan: {
          prevPrice: 19.99,
          price: 17.99,
          buttons: [
            {
              children: "Contratar Plan 400 mb",
              type: "button",
              color: "secondary"
            },
            {
              children: "Solicitar por WhatsApp",
              type: "link",
              href: "https://google.com.ec",
              target: "_blank",
              color: "noBorder"
            }
          ]
        }
      },
      {
        label: "Plan 600 mb",
        active: [true, true, true, true, false, false, false],
        plan: {
          prevPrice: 22.99,
          price: 19.99,
          buttons: [
            {
              children: "Contratar Plan 600 mb",
              type: "button",
              color: "primary"
            },
            {
              children: "Solicitar por WhatsApp",
              type: "link",
              href: "https://google.com.ec",
              target: "_blank",
              color: "outline"
            }
          ]
        }
      },
      {
        label: "Plan 700 mb",
        active: [true, true, true, true, true, false, false],
        plan: {
          prevPrice: 24.99,
          price: 21.99,
          buttons: [
            {
              children: "Contratar Plan 700 mb",
              type: "button",
              color: "primary"
            },
            {
              children: "Solicitar por WhatsApp",
              type: "link",
              href: "https://google.com.ec",
              target: "_blank",
              color: "outline"
            }
          ]
        }
      },
      {
        label: "Plan 1000 mb",
        active: [true, true, true, true, true, true, false],
        plan: {
          prevPrice: 29.99,
          price: 25.99,
          buttons: [
            {
              children: "Contratar Plan 1000 mb",
              type: "button",
              color: "primary"
            },
            {
              children: "Solicitar por WhatsApp",
              type: "link",
              href: "https://google.com.ec",
              target: "_blank",
              color: "outline"
            }
          ]
        }
      },
      {
        label: "Plan 1200 mb",
        active: [true, true, true, true, true, true, true],
        plan: {
          prevPrice: 34.99,
          price: 29.99,
          buttons: [
            {
              children: "Contratar Plan 1200 mb",
              type: "button",
              color: "primary"
            },
            {
              children: "Solicitar por WhatsApp",
              type: "link",
              href: "https://google.com.ec",
              target: "_blank",
              color: "outline"
            }
          ]
        }
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: `
**Vista con 6 planes:** Este ejemplo muestra cómo se comporta la tabla comparativa con 6 columnas de planes diferentes. 
Permite evaluar el diseño responsive y la usabilidad cuando hay más opciones para comparar. 
Los planes aumentan progresivamente sus características desde el básico (200 mb) hasta el premium (1200 mb).
`
      }
    }
  }
};

