import type { Meta, StoryObj } from '@storybook/react';
import { FAQCardsSlider } from '@shared-ui/components/faqCardsSlider';

const meta: Meta<typeof FAQCardsSlider> = {
  title: 'Layout/FAQ Cards Slider',
  component: FAQCardsSlider,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Slider de cards para preguntas frecuentes con comportamiento responsive y preview de la siguiente card.'
      }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Título opcional para la sección'
    },
    cards: {
      control: 'object',
      description: 'Array de preguntas frecuentes'
    }
  }
};

export default meta;
type Story = StoryObj<typeof FAQCardsSlider>;

const mockFAQCards = [
  {
    question: "¿Cómo puedo cambiar mi plan de internet?",
    description: "Conoce los pasos para cambiar tu plan de internet de manera fácil y rápida desde tu cuenta.",
    linkButton: {
      label: "Ver respuesta completa",
      href: "/faq/cambiar-plan-internet"
    }
  },
  {
    question: "¿Qué hacer si mi internet está lento?",
    description: "Aprende a diagnosticar y solucionar problemas de velocidad en tu conexión a internet.",
    linkButton: {
      label: "Ver respuesta completa", 
      href: "/faq/internet-lento"
    }
  },
  {
    question: "¿Cómo configurar mi router WiFi?",
    description: "Guía paso a paso para configurar correctamente tu router y optimizar tu red WiFi.",
    linkButton: {
      label: "Ver respuesta completa",
      href: "/faq/configurar-router"
    }
  },
  {
    question: "¿Cuáles son los métodos de pago disponibles?",
    description: "Conoce todas las opciones de pago que tenemos disponibles para tu comodidad.",
    linkButton: {
      label: "Ver respuesta completa",
      href: "/faq/metodos-pago"
    }
  },
  {
    question: "¿Cómo reportar una falla técnica?",
    description: "Aprende cómo reportar problemas técnicos y obtener soporte rápido y eficiente.",
    linkButton: {
      label: "Ver respuesta completa",
      href: "/faq/reportar-falla"
    }
  },
  {
    question: "¿Qué incluye mi plan de televisión?",
    description: "Descubre todos los canales y servicios incluidos en tu plan de televisión.",
    linkButton: {
      label: "Ver respuesta completa",
      href: "/faq/plan-television"
    }
  }
];

export const Default: Story = {
  args: {
    title: "Lo más preguntado",
    cards: mockFAQCards
  }
};

export const WithoutTitle: Story = {
  args: {
    cards: mockFAQCards.slice(0, 4)
  }
};

export const FewCards: Story = {
  args: {
    title: "Preguntas frecuentes",
    cards: mockFAQCards.slice(0, 3)
  }
};

export const ManyCards: Story = {
  args: {
    title: "Todas las preguntas frecuentes",
    cards: [
      ...mockFAQCards,
      {
        question: "¿Cómo cancelar mi servicio?",
        description: "Información sobre el proceso de cancelación y los pasos a seguir.",
        linkButton: {
          label: "Ver respuesta completa",
          href: "/faq/cancelar-servicio"
        }
      },
      {
        question: "¿Hay permanencia mínima?",
        description: "Conoce los términos y condiciones sobre la permanencia mínima de los servicios.",
        linkButton: {
          label: "Ver respuesta completa",
          href: "/faq/permanencia-minima"
        }
      }
    ]
  }
};