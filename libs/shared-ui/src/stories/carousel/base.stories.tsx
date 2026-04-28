import type { Meta, StoryObj } from "@storybook/react-vite";
import { Carousel } from "../../lib/components";
import type { ComponentType } from "react";

import Img1 from "../../assets/img/banner4.webp";
import Img2 from "../../assets/img/banner3.webp";
import Img3 from "../../assets/img/banner2.webp";
import Img4 from "../../assets/img/banner1.webp";

const description = `
El componente **Carousel** es una solución de slider robusta construida sobre **Swiper engine** y optimizada para React con **Tailwind 4**.

### Capacidades Principales:
- **Navegación Inteligente**: Soporta flechas estándar, paginación por puntos y grupos de avatares.
- **Bullets con Carga**: Los puntos de paginación incluyen una barra de progreso visual sincronizada con el tiempo de transición.
- **Smart Pause**: La navegación y las animaciones de carga se detienen automáticamente al hacer hover sobre el slide.
- **Altamente Personalizable**: Permite inyectar componentes personalizados para los slides mediante la prop \`Element\`.
`;

const meta = {
  component: Carousel,
  title: "Carousel/Base",
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
    tag: { table: { disable: true } },
    wrapperTag: { table: { disable: true } },
    onBeforeLoopFix: {
      description:
        "Se dispara justo antes de que Swiper ejecute el 'loop fix' (reajuste de posiciones en modo infinito).",
      action: "before-loop-fix",
      table: { category: "Events: Lifecycle" }
    },
    onLoopFix: {
      description:
        "Se dispara después de que Swiper ha corregido las posiciones de los slides en modo loop.",
      action: "loop-fix",
      table: { category: "Events: Lifecycle" }
    },
    onSlidesGridLengthChange: {
      description:
        "Se dispara cuando la longitud de la cuadrícula de los slides ha cambiado.",
      action: "slides-grid-change",
      table: { category: "Events: Lifecycle" }
    },
    onSnapGridLengthChange: {
      description:
        "Se dispara cuando la longitud de la cuadrícula de ajuste (snap grid) ha cambiado.",
      action: "snap-grid-change",
      table: { category: "Events: Lifecycle" }
    },

    _beforeBreakpoint: {
      description:
        "**Uso Interno**: Se dispara justo antes de aplicar cambios por un breakpoint.",
      action: "internal-before-breakpoint",
      table: { category: "Events: Internal" }
    },
    _containerClasses: {
      description:
        "**Uso Interno**: Se dispara al asignar las clases CSS al contenedor principal.",
      action: "internal-container-classes",
      table: { category: "Events: Internal" }
    },
    _slideClass: {
      description:
        "**Uso Interno**: Se dispara al asignar clases CSS a un slide individual.",
      action: "internal-slide-class",
      table: { category: "Events: Internal" }
    },
    _slideClasses: {
      description:
        "**Uso Interno**: Se dispara al asignar clases CSS a todos los slides del conjunto.",
      action: "internal-all-slide-classes",
      table: { category: "Events: Internal" }
    },
    _swiper: {
      description:
        "**Uso Interno**: Se dispara en cuanto la instancia de Swiper está disponible (antes de la inicialización).",
      action: "internal-instance-ready",
      table: { category: "Events: Internal" }
    },
    _freeModeNoMomentumRelease: {
      description:
        "**Uso Interno**: Se dispara al soltar el touch en modo libre cuando no hay inercia.",
      action: "internal-freemode-release",
      table: { category: "Events: Internal" }
    },
    onBeforeInit: {
      description: "Se dispara justo antes de que el carrusel se inicialice.",
      action: "before-init",
      table: { category: "Events: Lifecycle" }
    },
    onBeforeDestroy: {
      description: "Se dispara inmediatamente antes de destruir la instancia.",
      action: "before-destroy",
      table: { category: "Events: Lifecycle" }
    },
    onBeforeResize: {
      description:
        "Se dispara antes de ejecutar el manejador de cambio de tamaño de ventana.",
      action: "before-resize",
      table: { category: "Events: Lifecycle" }
    },
    onBeforeSlideChangeStart: {
      description:
        "Se dispara justo antes de que comience la transición de cambio de slide.",
      action: "before-slide-change",
      table: { category: "Events: Lifecycle" }
    },
    onBeforeTransitionStart: {
      description: "Se dispara justo antes del inicio de cualquier transición.",
      action: "before-transition",
      table: { category: "Events: Lifecycle" }
    },
    onSlidesUpdated: {
      description:
        "Se dispara después de calcular y actualizar el tamaño de los slides.",
      action: "slides-updated",
      table: { category: "Events: Lifecycle" }
    },
    onSlidesLengthChange: {
      description: "Se dispara cuando cambia la cantidad total de slides.",
      action: "slides-len-change",
      table: { category: "Events: Lifecycle" }
    },
    onSnapIndexChange: {
      description: "Se dispara al cambiar el índice de ajuste (snap index).",
      action: "snap-change",
      table: { category: "Events: Lifecycle" }
    },
    onObserverUpdate: {
      description: "Se dispara si el observador detecta mutaciones en el DOM.",
      action: "observer-update",
      table: { category: "Events: Lifecycle" }
    },
    onLock: {
      description:
        "Se dispara cuando el carrusel se bloquea por falta de slides suficientes.",
      action: "locked",
      table: { category: "Events: Lifecycle" }
    },
    onUnlock: {
      description: "Se dispara cuando el carrusel se desbloquea.",
      action: "unlocked",
      table: { category: "Events: Lifecycle" }
    },
    onChangeDirection: {
      description:
        "Se dispara al cambiar la dirección del carrusel (horizontal/vertical).",
      action: "direction-change",
      table: { category: "Events: Lifecycle" }
    },
    onOrientationchange: {
      description: "Se dispara al cambiar la orientación del dispositivo.",
      action: "orientation-change",
      table: { category: "Events: Lifecycle" }
    },
    onPaginationRender: {
      description: "Se dispara al renderizar los elementos de paginación.",
      action: "pag-render",
      table: { category: "Events: Modules" }
    },
    onPaginationUpdate: {
      description: "Se dispara cuando se actualiza el estado de la paginación.",
      action: "pag-update",
      table: { category: "Events: Modules" }
    },
    onPaginationShow: {
      description: "Se dispara al mostrar la paginación.",
      action: "pag-show",
      table: { category: "Events: Modules" }
    },
    onPaginationHide: {
      description: "Se dispara al ocultar la paginación.",
      action: "pag-hide",
      table: { category: "Events: Modules" }
    },
    onNavigationShow: {
      description: "Se dispara al mostrar la navegación.",
      action: "nav-show",
      table: { category: "Events: Modules" }
    },
    onNavigationHide: {
      description: "Se dispara al ocultar la navegación.",
      action: "nav-hide",
      table: { category: "Events: Modules" }
    },
    onScrollbarDragStart: {
      description: "Inicio del arrastre de la barra de desplazamiento.",
      action: "scroll-drag-start",
      table: { category: "Events: Modules" }
    },
    onScrollbarDragMove: {
      description:
        "Movimiento durante el arrastre de la barra de desplazamiento.",
      action: "scroll-drag-move",
      table: { category: "Events: Modules" }
    },
    onScrollbarDragEnd: {
      description: "Fin del arrastre de la barra de desplazamiento.",
      action: "scroll-drag-end",
      table: { category: "Events: Modules" }
    },
    onZoomChange: {
      description: "Se dispara al cambiar el nivel de zoom.",
      action: "zoom-change",
      table: { category: "Events: Modules" }
    },
    onHashChange: {
      description: "Se dispara al cambiar el hash de navegación en la URL.",
      action: "hash-change",
      table: { category: "Events: Modules" }
    },
    onHashSet: {
      description:
        "Se dispara cuando Swiper establece un nuevo hash en la URL.",
      action: "hash-set",
      table: { category: "Events: Modules" }
    },
    onTouchMoveOpposite: {
      description:
        "Se dispara cuando el usuario mueve el dedo en dirección opuesta al eje del carrusel.",
      action: "touch-move-opposite",
      table: { category: "Events: Interaction" }
    },
    onSliderFirstMove: {
      description:
        "Se dispara en el momento del primer movimiento de arrastre.",
      action: "slider-first-move",
      table: { category: "Events: Interaction" }
    },
    onToEdge: {
      description:
        "Se dispara cuando el carrusel llega al extremo inicial o final.",
      action: "to-edge",
      table: { category: "Events: Interaction" }
    },
    onFromEdge: {
      description:
        "Se dispara cuando el carrusel se aleja de una posición extrema.",
      action: "from-edge",
      table: { category: "Events: Interaction" }
    },
    onMomentumBounce: {
      description: "Se dispara durante el rebote de inercia (momentum bounce).",
      action: "momentum-bounce",
      table: { category: "Events: Interaction" }
    },
    onSlideChangeTransitionStart: {
      description:
        "Se dispara al inicio de la animación de cambio hacia otro slide.",
      action: "slide-transition-start",
      table: { category: "Events: Transitions" }
    },
    onSlideChangeTransitionEnd: {
      description: "Se dispara al finalizar la animación de cambio de slide.",
      action: "slide-transition-end",
      table: { category: "Events: Transitions" }
    },
    onSlideNextTransitionStart: {
      description:
        "Igual que el inicio de transición, pero específicamente para el sentido 'Siguiente'.",
      action: "next-start",
      table: { category: "Events: Transitions" }
    },
    onSlideNextTransitionEnd: {
      description:
        "Final de la transición específica para el sentido 'Siguiente'.",
      action: "next-end",
      table: { category: "Events: Transitions" }
    },
    onSlidePrevTransitionStart: {
      description:
        "Inicio de la transición específica para el sentido 'Anterior'.",
      action: "prev-start",
      table: { category: "Events: Transitions" }
    },
    onSlidePrevTransitionEnd: {
      description:
        "Final de la transición específica para el sentido 'Anterior'.",
      action: "prev-end",
      table: { category: "Events: Transitions" }
    },
    onSlideResetTransitionStart: {
      description:
        "Inicio de la animación cuando el slide vuelve a su posición actual (reset).",
      action: "reset-start",
      table: { category: "Events: Transitions" }
    },
    onSlideResetTransitionEnd: {
      description: "Fin de la animación de reset del slide.",
      action: "reset-end",
      table: { category: "Events: Transitions" }
    },
    onSetTransition: {
      description:
        "Se dispara cada vez que inicia una animación. Recibe la duración (ms).",
      action: "set-transition",
      table: { category: "Events: Transitions" }
    },
    onSetTranslate: {
      description:
        "Se dispara al cambiar la posición del wrapper. Recibe el valor de translación.",
      action: "set-translate",
      table: { category: "Events: Transitions" }
    },
    onAutoplayTimeLeft: {
      description:
        "Se dispara continuamente mientras el autoplay está activo. Indica el tiempo restante (ms) y el porcentaje transcurrido antes del siguiente cambio.",
      action: "autoplay-time-left",
      table: { category: "Events: Autoplay" }
    },
    onAutoplay: {
      description:
        "Se dispara cuando el slide cambia automáticamente a través de la función de autoplay.",
      action: "autoplay-event",
      table: { category: "Events: Autoplay" }
    },
    onAutoplayStart: {
      description: "Se dispara cuando la reproducción automática comienza.",
      action: "autoplay-start",
      table: { category: "Events: Autoplay" }
    },
    onAutoplayStop: {
      description: "Se dispara cuando la reproducción automática se detiene.",
      action: "autoplay-stop",
      table: { category: "Events: Autoplay" }
    },
    onAutoplayPause: {
      description:
        "Se dispara al pausar la reproducción automática (ej. por hover).",
      action: "autoplay-pause",
      table: { category: "Events: Autoplay" }
    },
    onAutoplayResume: {
      description: "Se dispara cuando la reproducción automática se reanuda.",
      action: "autoplay-resume",
      table: { category: "Events: Autoplay" }
    },
    onSlideChange: {
      description: "Se dispara cuando el slide activo cambia.",
      action: "slide-change",
      table: { category: "Events: Navigation" }
    },
    onActiveIndexChange: {
      description: "Se dispara cuando el índice del slide activo ha cambiado.",
      action: "active-index-change",
      table: { category: "Events: Navigation" }
    },
    onRealIndexChange: {
      description:
        "Se dispara cuando el índice real cambia (importante en modo loop).",
      action: "real-index-change",
      table: { category: "Events: Navigation" }
    },
    onNavigationNext: {
      description: "Se dispara al hacer clic en el botón de siguiente.",
      action: "nav-next",
      table: { category: "Events: Navigation" }
    },
    onNavigationPrev: {
      description: "Se dispara al hacer clic en el botón de anterior.",
      action: "nav-prev",
      table: { category: "Events: Navigation" }
    },
    onReachBeginning: {
      description: "Se dispara cuando el carrusel llega al primer slide.",
      action: "reach-beginning",
      table: { category: "Events: Navigation" }
    },
    onReachEnd: {
      description: "Se dispara cuando el carrusel llega al último slide.",
      action: "reach-end",
      table: { category: "Events: Navigation" }
    },
    onSliderMove: {
      description:
        "Se dispara cuando el usuario arrastra el carrusel con el dedo o mouse.",
      action: "slider-move",
      table: { category: "Events: Interaction" }
    },
    onTap: {
      description: "Se dispara cuando el usuario hace un clic o toque breve.",
      action: "tap",
      table: { category: "Events: Interaction" }
    },
    onDoubleTap: {
      description: "Se dispara cuando el usuario hace doble clic.",
      action: "double-tap",
      table: { category: "Events: Interaction" }
    },
    onInit: {
      description:
        "Se dispara inmediatamente después de la inicialización de Swiper.",
      action: "init",
      table: { category: "Events: Lifecycle" }
    },
    onAfterInit: {
      description:
        "Se dispara después de que toda la lógica inicial se ha ejecutado.",
      action: "after-init",
      table: { category: "Events: Lifecycle" }
    },
    onBreakpoint: {
      description: "Se dispara cuando cambia el breakpoint (responsive).",
      action: "breakpoint-change",
      table: { category: "Events: Lifecycle" }
    },
    onUpdate: {
      description:
        "Se dispara después de que el carrusel actualiza sus dimensiones.",
      action: "updated",
      table: { category: "Events: Lifecycle" }
    },
    onDestroy: {
      description:
        "Se dispara justo antes de que la instancia del carrusel sea destruida.",
      action: "destroy",
      table: { category: "Events: Lifecycle" }
    },
    Element: {
      control: false,
      description: "Elemento JSX que se renderizará en cada slide.",
      table: { category: "Content" }
    },
    data: {
      control: undefined,
      description: "Lista de elementos que se renderizarán en el carrusel.",
      table: { category: "Content" }
    },
    navigation: {
      control: "object",
      description: "Configuración de la navegación.",
      table: { category: "Navigation" }
    },
    loop: {
      control: "boolean",
      description: "Habilita el modo de bucle infinito.",
      table: { category: "Behavior" }
    },
    disabledAnimationSlide: {
      control: "boolean",
      description:
        "Si es falso, elimina la animación de carga al pasar el mouse.",
      table: { category: "Behavior" }
    },
    pagination: {
      control: "object",
      description: "Configuración de los bullets y tiempo de carga.",
      table: { category: "Navigation" }
    },
    onKeyPress: {
      control: undefined,
      description: "Callback que se ejecutará cuando se presione una tecla.",
      table: { category: "Events" }
    },
    onProgress: {
      control: undefined,
      description:
        "El evento se activará cuando se cambie el progreso de Swiper, como argumento recibe el progreso que siempre va de 0 a 1",
      table: { category: "Events" }
    },
    onClick: {
      control: undefined,
      description:
        "El evento se activará cuando el usuario haga clic o toque en Swiper. Recibe el evento 'pointerup' como argumento.",
      table: { category: "Events" }
    },
    onDoubleClick: {
      control: undefined,
      description:
        "El evento se activará cuando el usuario haga doble clic o toque en Swiper",
      table: { category: "Events" }
    },
    onTouchEnd: {
      control: undefined,
      description:
        "El evento se activará cuando el usuario suelte Swiper. Recibe el evento 'pointerup' como argumento.",
      table: { category: "Events" }
    },
    onTouchMove: {
      control: undefined,
      description:
        "El evento se activará cuando el usuario toque y mueva el dedo sobre Swiper. Recibe el evento 'pointermove' como argumento.",
      table: { category: "Events" }
    },
    onTouchStart: {
      control: undefined,
      description:
        "El evento se activará cuando el usuario toque Swiper. Recibe el evento de puntero hacia abajo como argumento.",
      table: { category: "Events" }
    },
    onScroll: {
      control: undefined,
      description:
        "El evento se activará cuando Swiper se desplaza. Recibe el evento 'scroll' como argumento.",
      table: { category: "Events" }
    },
    onTransitionEnd: {
      control: undefined,
      description:
        "El evento se activará cuando Swiper termina de moverse. Recibe el evento 'transitionend' como argumento.",
      table: { category: "Events" }
    },
    onResize: {
      control: undefined,
      description:
        "El evento se activará al cambiar el tamaño de la ventana justo antes de la manipulación onresize del deslizador.",
      table: { category: "Events" }
    },
    onSwiper: {
      control: undefined,
      description: "Obtiene la instancia del Swiper.",
      table: { category: "Events" }
    },
    onAutoPlayStart: {
      control: undefined,
      description: "El evento se activará cuando se inicia el auto-play.",
      table: { category: "Events" }
    },
    onAutoPlayStop: {
      control: undefined,
      description: "El evento se activará cuando se detiene el auto-play.",
      table: { category: "Events" }
    },
    onAutoPlayPause: {
      control: undefined,
      description: "El evento se activará cuando se pausa el auto-play.",
      table: { category: "Events" }
    },

    className: {
      control: "object",
      description:
        "Clases CSS personalizadas para diferentes partes del componente.",
      table: {
        category: "Styles"
      }
    }
  }
} satisfies Meta<unknown>;

export default meta;
type Story = StoryObj<typeof meta>;

const Slide: ComponentType<{ title?: string }> = ({ title }) =>
  (
    <div className="border-primary flex h-[40dvh] items-center justify-center rounded-lg border p-4">
      <span className="text-body block">{title || ""}</span>
    </div>
  );

const data = new Array(5).fill(0).map((_, idx) => ({
  id: idx,
  title: `Item ${idx + 1}`
}));

export const Default: Story = {
  args: {
    className: {
      base: "",
      navigation: "",
      pagination: "",
      slide: "",
      wrapper: "",
      swiper: ""
    },
    Element: Slide,
    data
  },
  parameters: {
    docs: {
      description: {
        story: "Configuración básica del carrusel con navegación manual."
      }
    }
  }
};

export const Loop: Story = {
  args: {
    className: {
      base: "",
      navigation: "",
      pagination: "",
      slide: "",
      wrapper: "",
      swiper: ""
    },
    Element: Slide,
    data,
    loop: true
  },
  parameters: {
    docs: {
      description: {
        story:
          "Carrusel en modo bucle infinito. Al llegar al último elemento, regresa al primero de forma fluida."
      }
    }
  }
};

export const Pagination: Story = {
  args: {
    className: {
      base: "",
      navigation: "",
      pagination: "",
      slide: "",
      wrapper: "",
      swiper: ""
    },
    Element: Slide,
    data,
    pagination: true
  },
  parameters: {
    docs: {
      description: {
        story: "Esta variante muestra los **Bullets**. de paginación."
      }
    }
  }
};

export const NavigationArrows: Story = {
  args: {
    className: {
      base: "",
      navigation: "",
      pagination: "",
      slide: "",
      wrapper: "",
      swiper: ""
    },
    Element: Slide,
    data,
    loop: true,
    navigation: {
      type: "arrows"
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Añade controles laterales (flechas) para una navegación manual explícita."
      }
    }
  }
};

export const NavigationArrowsHiddenFirstAndLast: Story = {
  args: {
    className: {
      base: "",
      navigation: "",
      pagination: "",
      slide: "",
      wrapper: "",
      swiper: ""
    },
    Element: Slide,
    data,
    navigation: {
      type: "arrows",
      hiddenArrowOnFirstAndLast: true
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Oculta la flecha de la izquierda en el primer elemento, tambien oculta la flecha derecha al llegar al último elemento."
      }
    }
  }
};

export const NavigationHero: Story = {
  args: {
    className: {
      base: "",
      navigation: "",
      pagination: "",
      slide: "",
      wrapper: "",
      swiper: ""
    },
    Element: Slide,
    data,
    navigation: {
      className: { base: "", text: "" },
      type: "avatars",
      text: "Bienvenida",
      avatarGroup: {
        size: "sm",
        border: true,
        animation: true,
        avatars: [
          { src: Img1 as unknown as string },
          { src: Img2 as unknown as string, active: true },
          { src: Img3 as unknown as string },
          { src: Img4 as unknown as string }
        ]
      }
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Navegación avanzada estilo 'Hero', integrando un grupo de avatares sincronizados con el índice activo."
      }
    }
  }
};

export const LoopDurationTransition: Story = {
  args: {
    className: {
      base: "",
      navigation: "",
      pagination: "",
      slide: "",
      wrapper: "",
      swiper: ""
    },
    Element: Slide,
    data,
    loop: true,
    disabledAnimationSlide: false,
    pagination: {
      duration: 50000
    },
    navigation: {
      type: "arrows"
    }
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demostración de ciclo rápido (1.5s). Nota cómo la pausa al hacer hover detiene tanto el slide como la barra de carga."
      }
    }
  }
};

export const SingleSlide: Story = {
  args: {
    className: {
      base: "",
      navigation: "",
      pagination: "",
      slide: "",
      wrapper: "",
      swiper: ""
    },
    Element: Slide,
    data: [{ id: 1, title: "Único Item" }],
    loop: false,
    disabledAnimationSlide: false,
    pagination: undefined,
    navigation: undefined
  },
  parameters: {
    docs: {
      description: {
        story:
          "Cuando solo hay un slide, no se muestra paginación (bullets) ni navegación. Este caso es útil para banners estáticos o contenido único que no requiere interacción de usuario."
      }
    }
  }
};

