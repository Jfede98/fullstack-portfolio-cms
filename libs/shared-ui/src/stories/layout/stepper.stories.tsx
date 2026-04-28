import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";
import {
  configureStore,
  createAsyncThunk,
  createSlice,
  type PayloadAction
} from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  Button,
  Stepper,
  StepperItem,
  TextField,
  Typography
} from "../../lib/components";
import type { IStepperContentControls, IStepperProps } from "../../lib/interfaces";

const description = `
El componente **Stepper** se usa por composición con **children** mediante **\`<StepperItem />\`**.

- No se usa \`steps\` por props.
- \`navigationMode="free"\`: permite click entre pasos.
- \`navigationMode="linear"\`: flujo lineal controlado por eventos internos o botones de navegación.
- \`navigationButtons\`: configuración visual/behavior de Regresar/Continuar.

Recomendación de arquitectura: en frontend productivo, controlar \`activeStep\` y la data del flujo con **Redux Toolkit**.
`;

const meta = {
  component: Stepper,
  title: "Layout/Stepper",
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        type: "code"
      },
      description: {
        component: description
      }
    }
  },
  argTypes: {
    children: {
      description:
        "Definición de pasos con `children` usando `StepperItem`. No es editable en Controls.",
      control: false,
      table: { category: "Composition" }
    },
    navigationButtons: {
      control: "object",
      table: { category: "Navigation Buttons" }
    },
    navigationMode: {
      control: "inline-radio",
      options: ["free", "linear"],
      table: { category: "Behavior" }
    },
    allowStepNavigation: {
      control: "boolean",
      table: { category: "Behavior" }
    },
    showMobileLabels: {
      control: "boolean",
      table: { category: "Behavior" }
    },
    activeStep: {
      control: "number",
      table: { category: "State" }
    },
    defaultStep: {
      control: "number",
      table: { category: "State" }
    },
    completed: {
      control: "boolean",
      table: { category: "State" }
    },
    onStepChange: {
      action: "step changed",
      table: { category: "Events" }
    },
    onBack: {
      action: "back clicked",
      table: { category: "Events" }
    },
    onContinue: {
      action: "continue clicked",
      table: { category: "Events" }
    }
  }
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

const ComposedStepperDemo = ({ args }: { args: IStepperProps }) => {
  const [step, setStep] = useState(0);

  return (
    <Stepper
      {...args}
      activeStep={step}
      onStepChange={(nextStep) => {
        setStep(nextStep);
        args.onStepChange?.(nextStep);
      }}
      onBack={(nextStep) => args.onBack?.(nextStep)}
      onContinue={(nextStep) => args.onContinue?.(nextStep)}
    >
      <StepperItem id="coverage" label="Consulta cobertura">
        {({ nextStep }: IStepperContentControls) => (
          <div className="grid gap-6 md:grid-cols-2 md:items-start">
            <div className="space-y-4">
              <Typography
                tag="h2"
                variant="h1"
                type="bold"
                className={{ base: "text-primary-500" }}
              >
                Verifiquemos si llegamos a tu zona
              </Typography>
              <Typography tag="p" variant="title" type="regular">
                Ingresa tu ubicación para ver tu cobertura.
              </Typography>
              <div className="space-y-3">
                <TextField label="Ciudad" placeholder="Selecciona tu ciudad" />
                <TextField label="Dirección" placeholder="Ingresa tu dirección" />
                <Button color="secondary" onClick={nextStep}>
                  Ver mi cobertura
                </Button>
              </div>
            </div>

            <div className="h-80 w-full rounded-lg bg-[linear-gradient(160deg,#bde8d0_0%,#9bd8bb_45%,#88c7d8_100%)] p-4">
              <div className="h-full w-full rounded-md border border-white/50 bg-white/20" />
            </div>
          </div>
        )}
      </StepperItem>

      <StepperItem id="plan" label="Elige tu plan">
        {({ nextStep }: IStepperContentControls) => (
          <div className="space-y-3">
            <Typography
              tag="p"
              variant="subtitle"
              type="bold"
              className={{ base: "text-green-900" }}
            >
              ¡Genial! llegamos a tu zona
            </Typography>
            <Typography
              tag="h3"
              variant="h2"
              type="bold"
              className={{ base: "text-primary-500" }}
            >
              Escoge el plan ideal para ti
            </Typography>
            <Typography tag="p" variant="body">
              Te ofrecemos los mejores planes para tu zona.
            </Typography>
            <Button color="primary" size="fit" onClick={nextStep}>
              Elegir plan y continuar
            </Button>
          </div>
        )}
      </StepperItem>

      <StepperItem id="data" label="Deja tus datos">
        <div className="space-y-4 md:max-w-md">
          <Typography tag="h3" variant="h2" type="bold">
            Completa tus datos
          </Typography>
          <TextField label="Nombre completo" placeholder="Ingresa tu nombre" />
          <TextField label="Celular" placeholder="09XXXXXXXX" />
          <TextField
            label="Correo electrónico"
            placeholder="ejemplo@correo.com"
          />
        </div>
      </StepperItem>
    </Stepper>
  );
};

export const Default: Story = {
  render: (args) => <ComposedStepperDemo args={args} />,
  args: {
    navigationMode: "linear",
    allowStepNavigation: false,
    navigationButtons: {
      back: { visible: true, hideOnFirstStep: true, label: "Regresar" },
      continue: { visible: false }
    },
    showMobileLabels: false
  },
  parameters: {
    docs: {
      source: {
        code: `<Stepper activeStep={step} onStepChange={setStep}>
  <StepperItem id="coverage" label="Consulta cobertura">...</StepperItem>
  <StepperItem id="plan" label="Elige tu plan">...</StepperItem>
  <StepperItem id="data" label="Deja tus datos">...</StepperItem>
</Stepper>`
      }
    }
  }
};

export const OnlyBack: Story = {
  render: (args) => <ComposedStepperDemo args={args} />,
  args: {
    ...Default.args,
    navigationMode: "free",
    allowStepNavigation: true,
    navigationButtons: {
      back: { visible: true, hideOnFirstStep: true, label: "Regresar" },
      continue: { visible: false }
    }
  },
  parameters: {
    docs: {
      source: {
        code: `<Stepper
  activeStep={step}
  onStepChange={setStep}
  navigationMode="free"
  allowStepNavigation
  navigationButtons={{
    back: { visible: true, hideOnFirstStep: true, label: "Regresar" },
    continue: { visible: false }
  }}
>
  <StepperItem id="coverage" label="Consulta cobertura">...</StepperItem>
  <StepperItem id="plan" label="Elige tu plan">...</StepperItem>
  <StepperItem id="data" label="Deja tus datos">...</StepperItem>
</Stepper>`
      }
    }
  }
};

export const OnlyContinue: Story = {
  render: (args) => <ComposedStepperDemo args={args} />,
  args: {
    ...Default.args,
    navigationButtons: {
      back: { visible: false },
      continue: {
        visible: true,
        hideOnLastStep: true,
        disabled: false,
        label: "Continuar"
      }
    }
  },
  parameters: {
    docs: {
      source: {
        code: `<Stepper
  activeStep={step}
  onStepChange={setStep}
  navigationMode="linear"
  allowStepNavigation={false}
  navigationButtons={{
    back: { visible: false },
    continue: {
      visible: true,
      hideOnLastStep: true,
      disabled: false,
      label: "Continuar"
    }
  }}
>
  <StepperItem id="coverage" label="Consulta cobertura">...</StepperItem>
  <StepperItem id="plan" label="Elige tu plan">...</StepperItem>
  <StepperItem id="data" label="Deja tus datos">...</StepperItem>
</Stepper>`
      }
    }
  }
};

export const MultipleChildrenPerStep: Story = {
  render: (args) => {
    const Story = () => {
      const [step, setStep] = useState(0);

      return (
        <Stepper
          {...args}
          activeStep={step}
          onStepChange={setStep}
          navigationMode="linear"
          allowStepNavigation={false}
          navigationButtons={{
            back: { visible: true, hideOnFirstStep: true, label: "Regresar" },
            continue: { visible: false }
          }}
        >
          <StepperItem id="step-1" label="Paso con varios componentes">
            {({ nextStep }) => (
              <>
                <Typography tag="h3" variant="h2" type="bold">
                  Paso 1
                </Typography>
                <Typography tag="p" variant="body">
                  Este mismo step renderiza varios children: título, texto, campo y botón.
                </Typography>
                <TextField label="Referencia" placeholder="Ingresa un dato" />
                <Button color="secondary" size="fit" onClick={nextStep}>
                  Continuar
                </Button>
              </>
            )}
          </StepperItem>

          <StepperItem id="step-2" label="Confirmación">
            <div className="space-y-2">
              <Typography tag="h3" variant="h2" type="bold">
                Paso 2
              </Typography>
              <Typography tag="p" variant="body">
                Puedes mezclar componentes libremente dentro de cada StepperItem.
              </Typography>
            </div>
          </StepperItem>
        </Stepper>
      );
    };

    return <Story />;
  },
  args: {
    showMobileLabels: false
  },
  parameters: {
    docs: {
      description: {
        story:
          "Ejemplo explícito: un solo StepperItem puede contener múltiples componentes (Typography, TextField, Button, etc.)."
      },
      source: {
        code: `<Stepper activeStep={step} onStepChange={setStep}>
  <StepperItem id="step-1" label="Paso con varios componentes">
    {({ nextStep }) => (
      <>
        <Typography>Paso 1</Typography>
        <TextField label="Referencia" />
        <Button onClick={nextStep}>Continuar</Button>
      </>
    )}
  </StepperItem>

  <StepperItem id="step-2" label="Confirmación">
    <Typography>Paso 2</Typography>
  </StepperItem>
</Stepper>`
      }
    }
  }
};

type FlowState = {
  phone: string;
  documentId: string;
  selectedPlanId: string | null;
  activeStep: number;
  completed: boolean;
  validatingCoverage: boolean;
  coverageError: string | null;
};

const HOME_PAYLOAD = {
  phone: "0999999999",
  documentId: "0923456789",
  selectedPlanId: "plan-700"
} as const;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const validateCoverage = createAsyncThunk<
  void,
  { phone: string; documentId: string },
  { rejectValue: string }
>("stepperFlow/validateCoverage", async ({ phone, documentId }, api) => {
  await wait(3000);

  if (!phone.trim() || !documentId.trim()) {
    return api.rejectWithValue("Completa teléfono y cédula para continuar.");
  }

  return;
});

const flowSlice = createSlice({
  name: "stepperFlow",
  initialState: {
    phone: HOME_PAYLOAD.phone,
    documentId: HOME_PAYLOAD.documentId,
    selectedPlanId: HOME_PAYLOAD.selectedPlanId,
    activeStep: 0,
    completed: false,
    validatingCoverage: false,
    coverageError: null
  } as FlowState,
  reducers: {
    setPhone(state, action: PayloadAction<string>) {
      state.phone = action.payload;
      state.coverageError = null;
    },
    setDocumentId(state, action: PayloadAction<string>) {
      state.documentId = action.payload;
      state.coverageError = null;
    },
    setSelectedPlan(state, action: PayloadAction<string>) {
      state.selectedPlanId = action.payload;
    },
    setActiveStep(state, action: PayloadAction<number>) {
      state.activeStep = action.payload;
    },
    setCompleted(state, action: PayloadAction<boolean>) {
      state.completed = action.payload;
    },
    resetFlow(state) {
      state.phone = HOME_PAYLOAD.phone;
      state.documentId = HOME_PAYLOAD.documentId;
      state.selectedPlanId = null;
      state.activeStep = 0;
      state.completed = false;
      state.validatingCoverage = false;
      state.coverageError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateCoverage.pending, (state) => {
        state.validatingCoverage = true;
        state.coverageError = null;
      })
      .addCase(validateCoverage.fulfilled, (state) => {
        state.validatingCoverage = false;
      })
      .addCase(validateCoverage.rejected, (state, action) => {
        state.validatingCoverage = false;
        state.coverageError =
          action.payload ?? "No pudimos validar cobertura. Intenta nuevamente.";
      });
  }
});

const createFlowStore = () =>
  configureStore({
    reducer: {
      stepperFlow: flowSlice.reducer
    }
  });

type FlowStore = ReturnType<typeof createFlowStore>;
type RootState = ReturnType<FlowStore["getState"]>;
type AppDispatch = FlowStore["dispatch"];

const {
  setPhone,
  setDocumentId,
  setSelectedPlan,
  setActiveStep,
  setCompleted,
  resetFlow
} = flowSlice.actions;

const ReduxFlowContent = ({ args }: { args: IStepperProps }) => {
  const dispatch = useDispatch<AppDispatch>();
  const flow = useSelector((state: RootState) => state.stepperFlow);

  return (
    <Stepper
      {...args}
      activeStep={flow.activeStep}
      completed={flow.completed}
      onStepChange={(nextStep) => dispatch(setActiveStep(nextStep))}
      navigationMode="linear"
      allowStepNavigation={false}
      navigationButtons={{
        back: { visible: true, hideOnFirstStep: true, label: "Regresar" },
        continue: { visible: false }
      }}
    >
      <StepperItem id="coverage" label="Consulta cobertura">
        {({ nextStep }: IStepperContentControls) => (
          <div className="space-y-3 md:max-w-md">
            <Typography tag="p" variant="subtitle" type="bold">
              Flujo recomendado: estado controlado por Redux Toolkit
            </Typography>
            <TextField
              label="Número de teléfono"
              value={flow.phone}
              onChange={(event) => dispatch(setPhone(event.target.value))}
            />
            <TextField
              label="Cédula"
              value={flow.documentId}
              error={flow.coverageError ?? undefined}
              onChange={(event) => dispatch(setDocumentId(event.target.value))}
            />
            <Button
              color="secondary"
              disabled={flow.validatingCoverage}
              onClick={async () => {
                const result = await dispatch(
                  validateCoverage({
                    phone: flow.phone,
                    documentId: flow.documentId
                  })
                );

                if (validateCoverage.fulfilled.match(result)) {
                  nextStep();
                }
              }}
            >
              {flow.validatingCoverage ? "Validando..." : "Ver mi cobertura"}
            </Button>
          </div>
        )}
      </StepperItem>

      <StepperItem id="plan" label="Elige tu plan">
        {({ nextStep }: IStepperContentControls) => (
          <div className="space-y-3">
            <Typography tag="p" variant="body">
              Plan seleccionado: {flow.selectedPlanId ?? "ninguno"}
            </Typography>
            <div className="flex gap-2">
              <Button
                color="noBorder"
                size="fit"
                onClick={() => dispatch(setSelectedPlan("plan-400"))}
              >
                400 Mbps
              </Button>
              <Button
                color="noBorder"
                size="fit"
                onClick={() => dispatch(setSelectedPlan("plan-700"))}
              >
                700 Mbps
              </Button>
            </div>
            <Button
              color="primary"
              size="fit"
              disabled={!flow.selectedPlanId}
              onClick={nextStep}
            >
              Confirmar plan y continuar
            </Button>
          </div>
        )}
      </StepperItem>

      <StepperItem id="data" label="Deja tus datos">
        <div className="space-y-3 md:max-w-md">
          <Typography tag="p" variant="body">Teléfono: {flow.phone}</Typography>
          <Typography tag="p" variant="body">Cédula: {flow.documentId}</Typography>
          <Typography tag="p" variant="body">
            Plan: {flow.selectedPlanId ?? "sin seleccionar"}
          </Typography>
          <Button color="primary" size="fit" onClick={() => dispatch(setCompleted(true))}>
            Finalizar
          </Button>
          <Button color="noBorder" size="fit" onClick={() => dispatch(resetFlow())}>
            Reiniciar flujo
          </Button>
        </div>
      </StepperItem>
    </Stepper>
  );
};

export const ReduxFlowRecommended: Story = {
  render: (args) => {
    const Story = () => {
      const store = useMemo(() => createFlowStore(), []);

      return (
        <Provider store={store}>
          <ReduxFlowContent args={args} />
        </Provider>
      );
    };

    return <Story />;
  },
  args: {
    showMobileLabels: false
  },
  parameters: {
    docs: {
      description: {
        story:
          "Historia recomendada para frontend: Redux controla avance de pasos, persistencia de datos y finalización del flujo."
      },
      source: {
        code: `// En frontend real:
// 1) Guardas payload inicial (ej: viene desde Home)
// 2) Controlas activeStep/completed con Redux
// 3) Cada StepperItem dispara eventos internos (API success, selección de plan, finalizar)
<Provider store={store}>
  <Stepper activeStep={activeStep} onStepChange={setActiveStep}>
    <StepperItem id="coverage" label="Consulta cobertura">...</StepperItem>
    <StepperItem id="plan" label="Elige tu plan">...</StepperItem>
    <StepperItem id="data" label="Deja tus datos">...</StepperItem>
  </Stepper>
</Provider>`
      }
    }
  }
};

type FiveStepFlowState = {
  city: string;
  address: string;
  selectedPlanId: string | null;
  fullName: string;
  email: string;
  activeStep: number;
  completed: boolean;
};

const fiveStepInitialState: FiveStepFlowState = {
  city: "",
  address: "",
  selectedPlanId: null,
  fullName: "",
  email: "",
  activeStep: 0,
  completed: false
};

const fiveStepSlice = createSlice({
  name: "fiveStepFlow",
  initialState: fiveStepInitialState,
  reducers: {
    setCity(state, action: PayloadAction<string>) {
      state.city = action.payload;
    },
    setAddress(state, action: PayloadAction<string>) {
      state.address = action.payload;
    },
    setPlan(state, action: PayloadAction<string>) {
      state.selectedPlanId = action.payload;
    },
    setFullName(state, action: PayloadAction<string>) {
      state.fullName = action.payload;
    },
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setStep(state, action: PayloadAction<number>) {
      state.activeStep = action.payload;
    },
    setFlowCompleted(state, action: PayloadAction<boolean>) {
      state.completed = action.payload;
    },
    resetFiveStepFlow() {
      return fiveStepInitialState;
    }
  }
});

const createFiveStepStore = () =>
  configureStore({
    reducer: {
      fiveStepFlow: fiveStepSlice.reducer
    }
  });

type FiveStepStore = ReturnType<typeof createFiveStepStore>;
type FiveStepRootState = ReturnType<FiveStepStore["getState"]>;
type FiveStepDispatch = FiveStepStore["dispatch"];

const {
  setCity,
  setAddress,
  setPlan,
  setFullName,
  setEmail,
  setStep,
  setFlowCompleted,
  resetFiveStepFlow
} = fiveStepSlice.actions;

const FiveStepFlowContent = ({ args }: { args: IStepperProps }) => {
  const dispatch = useDispatch<FiveStepDispatch>();
  const flow = useSelector((state: FiveStepRootState) => state.fiveStepFlow);

  return (
    <Stepper
      {...args}
      activeStep={flow.activeStep}
      completed={flow.completed}
      onStepChange={(nextStep) => dispatch(setStep(nextStep))}
      navigationMode="linear"
      allowStepNavigation={false}
      navigationButtons={{
        back: { visible: true, hideOnFirstStep: true, label: "Regresar" },
        continue: { visible: false }
      }}
    >
      <StepperItem id="coverage" label="Cobertura">
        {({ nextStep }) => (
          <div className="space-y-3 md:max-w-md">
            <TextField
              label="Ciudad"
              value={flow.city}
              onChange={(event) => dispatch(setCity(event.target.value))}
            />
            <TextField
              label="Dirección"
              value={flow.address}
              onChange={(event) => dispatch(setAddress(event.target.value))}
            />
            <Button
              color="secondary"
              size="fit"
              disabled={!flow.city || !flow.address}
              onClick={nextStep}
            >
              Continuar a planes
            </Button>
          </div>
        )}
      </StepperItem>

      <StepperItem id="plan" label="Plan">
        {({ nextStep }) => (
          <div className="space-y-3">
            <Typography tag="p" variant="body">Selecciona tu plan</Typography>
            <div className="flex gap-2">
              <Button color="noBorder" size="fit" onClick={() => dispatch(setPlan("plan-400"))}>
                400 Mbps
              </Button>
              <Button color="noBorder" size="fit" onClick={() => dispatch(setPlan("plan-700"))}>
                700 Mbps
              </Button>
            </div>
            <Button
              color="primary"
              size="fit"
              disabled={!flow.selectedPlanId}
              onClick={nextStep}
            >
              Continuar datos personales
            </Button>
          </div>
        )}
      </StepperItem>

      <StepperItem id="personal" label="Datos">
        {({ nextStep }) => (
          <div className="space-y-3 md:max-w-md">
            <TextField
              label="Nombre completo"
              value={flow.fullName}
              onChange={(event) => dispatch(setFullName(event.target.value))}
            />
            <Button
              color="primary"
              size="fit"
              disabled={!flow.fullName}
              onClick={nextStep}
            >
              Continuar contacto
            </Button>
          </div>
        )}
      </StepperItem>

      <StepperItem id="contact" label="Contacto">
        {({ nextStep }) => (
          <div className="space-y-3 md:max-w-md">
            <TextField
              label="Correo electrónico"
              value={flow.email}
              onChange={(event) => dispatch(setEmail(event.target.value))}
            />
            <Button
              color="primary"
              size="fit"
              disabled={!flow.email}
              onClick={nextStep}
            >
              Ir a resumen
            </Button>
          </div>
        )}
      </StepperItem>

      <StepperItem id="summary" label="Resumen">
        <div className="space-y-3 md:max-w-md">
          <Typography tag="p" variant="body">Ciudad: {flow.city || "-"}</Typography>
          <Typography tag="p" variant="body">Dirección: {flow.address || "-"}</Typography>
          <Typography tag="p" variant="body">Plan: {flow.selectedPlanId || "-"}</Typography>
          <Typography tag="p" variant="body">Nombre: {flow.fullName || "-"}</Typography>
          <Typography tag="p" variant="body">Correo: {flow.email || "-"}</Typography>
          <div className="flex gap-2">
            <Button color="primary" size="fit" onClick={() => dispatch(setFlowCompleted(true))}>
              Finalizar
            </Button>
            <Button color="noBorder" size="fit" onClick={() => dispatch(resetFiveStepFlow())}>
              Reiniciar desde cero
            </Button>
          </div>
        </div>
      </StepperItem>
    </Stepper>
  );
};

export const ReduxFlowFiveSteps: Story = {
  render: (args) => {
    const Story = () => {
      const store = useMemo(() => createFiveStepStore(), []);

      return (
        <Provider store={store}>
          <FiveStepFlowContent args={args} />
        </Provider>
      );
    };

    return <Story />;
  },
  args: {
    showMobileLabels: false
  },
  parameters: {
    docs: {
      description: {
        story:
          "Flujo Redux de 5 pasos con reset total. El botón 'Reiniciar desde cero' vuelve al paso 1 y limpia todos los datos."
      },
      source: {
        code: `<Provider store={store}>
  <Stepper
    activeStep={activeStep}
    completed={completed}
    onStepChange={setStep}
    navigationMode="linear"
    allowStepNavigation={false}
    navigationButtons={{
      back: { visible: true, hideOnFirstStep: true, label: "Regresar" },
      continue: { visible: false }
    }}
  >
    <StepperItem id="coverage" label="Cobertura">...</StepperItem>
    <StepperItem id="plan" label="Plan">...</StepperItem>
    <StepperItem id="personal" label="Datos">...</StepperItem>
    <StepperItem id="contact" label="Contacto">...</StepperItem>
    <StepperItem id="summary" label="Resumen">...</StepperItem>
  </Stepper>
</Provider>

// En summary:
// dispatch(resetFiveStepFlow()) -> vuelve a paso 1 y limpia todo`
      }
    }
  }
};
