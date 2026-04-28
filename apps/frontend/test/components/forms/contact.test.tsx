import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { ContactForm } from "@components/forms/contact";
import { FormContactContext } from "@context/formContact";
import { makeStore } from "@store/semiautomaticFlow";

const ButtonMock: any = jest.fn(({ children }: any) => (
  <button>{children}</button>
));
const IconMock: any = jest.fn(() => <div data-testid="icon" />);
const TypographyMock: any = jest.fn(({ children }: any) => <span>{children}</span>);
const FieldMock: any = jest.fn(() => <div data-testid="field" />);
const CheckboxCustomMock: any = jest.fn(() => <div data-testid="checkbox" />);
const ClientPlanCardMock: any = jest.fn(() => <div data-testid="plan-card" />);
const ChangePlanModalMock: any = jest.fn(() => <div data-testid="change-plan-modal" />);

jest.mock("@sitio-publico/shared-ui", () => ({
  Button: (props: any) => ButtonMock(props),
  Icon: (props: any) => IconMock(props),
  Typography: (props: any) => TypographyMock(props),
  CheckboxCustom: (props: any) => CheckboxCustomMock(props)
}));

jest.mock("@components/forms/contact/field", () => ({
  Field: (props: any) => FieldMock(props)
}));

jest.mock("@components/client/ClientPlanCard", () => ({
  ClientPlanCard: (props: any) => ClientPlanCardMock(props)
}));

jest.mock("@components/flows/automatic/ChangePlanModal", () => ({
  ChangePlanModal: (props: any) => ChangePlanModalMock(props)
}));

describe("ContactForm", () => {
  beforeEach(() => {
    ButtonMock.mockClear();
    IconMock.mockClear();
    TypographyMock.mockClear();
    FieldMock.mockClear();
    CheckboxCustomMock.mockClear();
    ClientPlanCardMock.mockClear();
    ChangePlanModalMock.mockClear();
  });

  it("renders fields from context data and submits", () => {
    const handleSubmit = jest.fn((e: any) => e.preventDefault());
    const getFieldProps = jest.fn();
    const setFieldValue = jest.fn();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={makeStore()}>
        <FormContactContext.Provider
          value={{
            data: {
              title: "Contacto",
              description: "Desc",
              icon: { name: "info" },
              inputs: [{ name: "document", label: "Doc" }] as any,
              button: { children: "Enviar" } as any,
              privacyCheckbox: {
                label: "Acepto terminos",
                name: "privacy_policy",
                required: true
              }
            },
            handleSubmit,
            getFieldProps,
            setFieldValue,
            loading: false,
            errors: {}
          }}
        >
          {children}
        </FormContactContext.Provider>
      </Provider>
    );

    render(<ContactForm />, { wrapper });

    expect(screen.getByText("Contacto")).toBeInTheDocument();
    expect(screen.getByText("Desc")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getAllByTestId("field")).toHaveLength(1);
    expect(screen.getByTestId("checkbox")).toBeInTheDocument();
    expect(ButtonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        children: "Enviar",
        disabled: false
      })
    );
  });

  it("passes privacy field props and handles checkbox change", () => {
    const handleSubmit = jest.fn((e: any) => e.preventDefault());
    const getFieldProps = jest.fn(() => ({ onBlur: jest.fn() })) as any;
    const setFieldValue = jest.fn();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={makeStore()}>
        <FormContactContext.Provider
          value={{
            data: {
              title: "Contacto",
              description: "",
              inputs: [{ name: "document", label: "Doc" }] as any,
              button: { children: "Enviar" } as any,
              privacyCheckbox: {
                label: "Acepto terminos",
                name: "privacy_policy",
                required: true
              }
            },
            handleSubmit,
            getFieldProps,
            setFieldValue,
            loading: false,
            errors: { privacy_policy: "Debe aceptar" } as any,
            touched: { privacy_policy: true } as any,
            values: { privacy_policy: false } as any
          }}
        >
          {children}
        </FormContactContext.Provider>
      </Provider>
    );

    render(<ContactForm />, { wrapper });

    const checkboxProps =
      CheckboxCustomMock.mock.calls[CheckboxCustomMock.mock.calls.length - 1][0];
    expect(checkboxProps.errorMessage).toBe("Debe aceptar");
    checkboxProps.onChange({ target: { checked: true } });
    expect(setFieldValue).toHaveBeenCalledWith("privacy_policy", true);
    expect(checkboxProps.onBlur).toEqual(expect.any(Function));
  });

  it("shows privacy error message when submitCount is greater than zero", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={makeStore()}>
        <FormContactContext.Provider
          value={{
            data: {
              title: "Contacto",
              description: "",
              inputs: [{ name: "document", label: "Doc" }] as any,
              button: { children: "Enviar" } as any,
              privacyCheckbox: {
                label: "Acepto terminos",
                name: "privacy_policy",
                required: true
              }
            },
            getFieldProps: jest.fn(() => ({ onBlur: jest.fn() })) as any,
            loading: false,
            errors: { privacy_policy: "Debe aceptar" } as any,
            touched: {} as any,
            submitCount: 1,
            values: { privacy_policy: false } as any
          }}
        >
          {children}
        </FormContactContext.Provider>
      </Provider>
    );

    render(<ContactForm />, { wrapper });

    const checkboxProps =
      CheckboxCustomMock.mock.calls[CheckboxCustomMock.mock.calls.length - 1][0];
    expect(checkboxProps.errorMessage).toBe("Debe aceptar");
  });

  it("falls back to props when context data is missing", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={makeStore()}>
        <FormContactContext.Provider value={{} as any}>
          {children}
        </FormContactContext.Provider>
      </Provider>
    );

    render(
      <ContactForm
        title="Titulo"
        description="Desc"
        icon={{ name: "info" } as any}
        inputs={[{ name: "phone", label: "Tel" } as any]}
        button={{ children: "Enviar" } as any}
      />,
      { wrapper }
    );

    expect(screen.getByText("Titulo")).toBeInTheDocument();
    expect(screen.getByText("Desc")).toBeInTheDocument();
  });

  it("renders inline plan card for semiautomatic data", () => {
    const store = makeStore();
    store.dispatch({
      type: "semiautomaticFlow/setSelectedPlan",
      payload: { id: 1, name: "Plan" }
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>
        <FormContactContext.Provider
          value={{
            data: {
              title: "Contacto",
              description: "",
              inputs: [{ name: "document", label: "Doc" }] as any,
              button: { children: "Enviar" } as any,
              showSelectedPlanInline: true,
              variant: "semiautomatic-data"
            },
            getFieldProps: jest.fn(() => ({ onBlur: jest.fn() })) as any,
            setFieldValue: jest.fn(),
            loading: false,
            errors: {},
            values: {}
          }}
        >
          {children}
        </FormContactContext.Provider>
      </Provider>
    );

    render(<ContactForm />, { wrapper });
    expect(ClientPlanCardMock).toHaveBeenCalled();
    expect(ChangePlanModalMock).toHaveBeenCalled();
  });

  it("opens change plan modal when clicking action", () => {
    const store = makeStore();
    store.dispatch({
      type: "semiautomaticFlow/setSelectedPlan",
      payload: { id: 1, name: "Plan" }
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>
        <FormContactContext.Provider
          value={{
            data: {
              title: "Contacto",
              description: "",
              inputs: [{ name: "document", label: "Doc" }] as any,
              button: { children: "Enviar" } as any,
              showSelectedPlanInline: true,
              variant: "semiautomatic-data"
            },
            getFieldProps: jest.fn(() => ({ onBlur: jest.fn() })) as any,
            setFieldValue: jest.fn(),
            loading: false,
            errors: {},
            values: {}
          }}
        >
          {children}
        </FormContactContext.Provider>
      </Provider>
    );

    render(<ContactForm />, { wrapper });
    const actionButton = screen.getByText("Cambiar plan");
    fireEvent.click(actionButton);
    expect(ChangePlanModalMock).toHaveBeenCalledWith(
      expect.objectContaining({ isOpen: true })
    );

    const changePlanModalProps = ChangePlanModalMock.mock.calls[ChangePlanModalMock.mock.calls.length - 1][0];
    act(() => changePlanModalProps.onClose());
  });

  it("scopes privacy checkbox name when leadSelection is provided for block", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={makeStore()}>
        <FormContactContext.Provider
          value={{
            data: {
              title: "Contacto",
              description: "",
              inputs: [{ name: "document", label: "Doc" }] as any,
              button: { children: "Enviar" } as any,
              privacyCheckbox: { label: "Acepto", name: "privacy_policy", required: true }
            },
            getFieldProps: jest.fn(() => ({ onBlur: jest.fn() })) as any,
            setFieldValue: jest.fn(),
            loading: false,
            errors: {},
            values: { privacy_policy__doc1: false } as any
          }}
        >
          {children}
        </FormContactContext.Provider>
      </Provider>
    );

    render(
      <ContactForm
        isBlock
        leadSelection={{ leadFormDocumentId: "doc1" } as any}
        privacyCheckbox={{ label: "Acepto", name: "privacy_policy", required: true }}
      />,
      { wrapper }
    );

    const checkboxProps =
      CheckboxCustomMock.mock.calls[CheckboxCustomMock.mock.calls.length - 1][0];
    expect(checkboxProps.name).toBe("privacy_policy__doc1");
  });

  it("renders inline plan card for non semiautomatic data on mobile", () => {
    const store = makeStore();
    store.dispatch({
      type: "semiautomaticFlow/setSelectedPlan",
      payload: { id: 1, name: "Plan" }
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>
        <FormContactContext.Provider
          value={{
            data: {
              title: "Contacto",
              description: "",
              inputs: [{ name: "document", label: "Doc" }] as any,
              button: { children: "Enviar" } as any,
              showSelectedPlanInline: true,
              variant: "default"
            },
            getFieldProps: jest.fn(() => ({ onBlur: jest.fn() })) as any,
            setFieldValue: jest.fn(),
            loading: false,
            errors: {},
            values: {}
          }}
        >
          {children}
        </FormContactContext.Provider>
      </Provider>
    );

    render(<ContactForm />, { wrapper });
    expect(ClientPlanCardMock).toHaveBeenCalled();
  });

  it("uses submit type when not coverage action", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={makeStore()}>
        <FormContactContext.Provider
          value={{
            data: {
              title: "Contacto",
              description: "",
              inputs: [{ name: "document", label: "Doc" }] as any,
              button: { children: "Enviar", identifier: 1 } as any
            },
            getFieldProps: jest.fn(() => ({ onBlur: jest.fn() })) as any,
            setFieldValue: jest.fn(),
            loading: false,
            errors: {},
            values: {}
          }}
        >
          {children}
        </FormContactContext.Provider>
      </Provider>
    );

    render(<ContactForm />, { wrapper });
    const buttonProps = ButtonMock.mock.calls[0][0];
    expect(buttonProps.type).toBe("submit");
  });

  it("adds column layout classes when input column is full", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={makeStore()}>
        <FormContactContext.Provider
          value={{
            data: {
              title: "Contacto",
              description: "",
              inputs: [{ name: "document", label: "Doc", column: "full" }] as any,
              button: { children: "Enviar" } as any,
              variant: "columnLayout"
            },
            getFieldProps: jest.fn(() => ({ onBlur: jest.fn() })) as any,
            setFieldValue: jest.fn(),
            loading: false,
            errors: {},
            values: {}
          }}
        >
          {children}
        </FormContactContext.Provider>
      </Provider>
    );

    const { getByTestId } = render(<ContactForm />, { wrapper });
    const wrapperDiv = getByTestId("field").parentElement;
    expect(wrapperDiv?.className).toContain("lg:col-span-2");
  });

  it("keeps default layout when column data exists but variant is not columnLayout", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={makeStore()}>
        <FormContactContext.Provider
          value={{
            data: {
              title: "Contacto",
              description: "",
              inputs: [{ name: "document", label: "Doc", column: "left" }] as any,
              button: { children: "Enviar" } as any,
              variant: "default"
            },
            getFieldProps: jest.fn(() => ({ onBlur: jest.fn() })) as any,
            setFieldValue: jest.fn(),
            loading: false,
            errors: {},
            values: {}
          }}
        >
          {children}
        </FormContactContext.Provider>
      </Provider>
    );

    const { getByTestId } = render(<ContactForm />, { wrapper });
    const wrapperDiv = getByTestId("field").parentElement;
    expect(wrapperDiv?.className).not.toContain("lg:col-span-2");
  });

  it("adds column layout classes when input column is left and variant is columnLayout", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={makeStore()}>
        <FormContactContext.Provider
          value={{
            data: {
              title: "Contacto",
              description: "",
              inputs: [{ name: "document", label: "Doc", column: "left" }] as any,
              button: { children: "Enviar" } as any,
              variant: "columnLayout"
            },
            getFieldProps: jest.fn(() => ({ onBlur: jest.fn() })) as any,
            setFieldValue: jest.fn(),
            loading: false,
            errors: {},
            values: {}
          }}
        >
          {children}
        </FormContactContext.Provider>
      </Provider>
    );

    const { getByTestId } = render(<ContactForm />, { wrapper });
    const wrapperDiv = getByTestId("field").parentElement;
    expect(wrapperDiv?.className).not.toContain("lg:col-span-2");
    expect(wrapperDiv?.className).toContain("flex-1 min-w-50");
  });

  it("adds default column layout classes when input column is missing and variant is columnLayout", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={makeStore()}>
        <FormContactContext.Provider
          value={{
            data: {
              title: "Contacto",
              description: "",
              inputs: [{ name: "document", label: "Doc" }] as any,
              button: { children: "Enviar" } as any,
              variant: "columnLayout"
            },
            getFieldProps: jest.fn(() => ({ onBlur: jest.fn() })) as any,
            setFieldValue: jest.fn(),
            loading: false,
            errors: {},
            values: {}
          }}
        >
          {children}
        </FormContactContext.Provider>
      </Provider>
    );

    const { getByTestId } = render(<ContactForm />, { wrapper });
    const wrapperDiv = getByTestId("field").parentElement;
    expect(wrapperDiv?.className).toContain("flex-1 min-w-50");
  });

  it("disables action in checkout flow when required fields are missing", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={makeStore()}>
        <FormContactContext.Provider
          value={{
            data: {
              title: "Contacto",
              description: "",
              inputs: [{ name: "document", label: "Doc", required: true }] as any,
              button: { children: "Enviar" } as any,
              variant: "semiautomatic-data"
            },
            getFieldProps: jest.fn(() => ({ onBlur: jest.fn() })) as any,
            setFieldValue: jest.fn(),
            loading: false,
            errors: {},
            values: { document: "" }
          }}
        >
          {children}
        </FormContactContext.Provider>
      </Provider>
    );

    render(<ContactForm />, { wrapper });
    const buttonProps = ButtonMock.mock.calls[0][0];
    expect(buttonProps.disabled).toBe(true);
  });

  it("syncs context on focus when isBlock", () => {
    const handlerData = jest.fn();
    const setLeadSelection = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={makeStore()}>
        <FormContactContext.Provider
          value={{
            data: {
              title: "Contacto",
              description: "",
              inputs: [{ name: "document", label: "Doc" }] as any,
              button: { children: "Enviar" } as any
            },
            handlerData,
            setLeadSelection,
            getFieldProps: jest.fn(() => ({ onBlur: jest.fn() })) as any,
            setFieldValue: jest.fn(),
            loading: false,
            errors: {},
            values: {}
          }}
        >
          {children}
        </FormContactContext.Provider>
      </Provider>
    );

    const { container } = render(<ContactForm isBlock />, { wrapper });
    const form = container.querySelector("form")!;
    form.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    expect(handlerData).toHaveBeenCalled();
    expect(setLeadSelection).toHaveBeenCalled();
  });

  it("calls handleSubmit on form submit for block", () => {
    const handleSubmit = jest.fn((e: any) => e.preventDefault());
    const handlerData = jest.fn();
    const setLeadSelection = jest.fn();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={makeStore()}>
        <FormContactContext.Provider
          value={{
            data: {
              title: "Contacto",
              description: "",
              inputs: [{ name: "document", label: "Doc" }] as any,
              button: { children: "Enviar" } as any
            },
            handleSubmit,
            handlerData,
            setLeadSelection,
            getFieldProps: jest.fn(() => ({ onBlur: jest.fn() })) as any,
            setFieldValue: jest.fn(),
            loading: false,
            errors: {},
            values: {}
          }}
        >
          {children}
        </FormContactContext.Provider>
      </Provider>
    );

    const { container } = render(<ContactForm isBlock />, { wrapper });
    const form = container.querySelector("form")!;
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    expect(handleSubmit).toHaveBeenCalled();
    expect(handlerData).toHaveBeenCalled();
    expect(setLeadSelection).toHaveBeenCalled();
  });

  it("skips top icon for semiautomatic variants", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={makeStore()}>
        <FormContactContext.Provider
          value={{
            data: {
              title: "Contacto",
              description: "",
              icon: { name: "info" },
              inputs: [{ name: "document", label: "Doc" }] as any,
              button: { children: "Enviar" } as any,
              variant: "semiautomatic-flow"
            },
            getFieldProps: jest.fn(() => ({ onBlur: jest.fn() })) as any,
            setFieldValue: jest.fn(),
            loading: false,
            errors: {},
            values: {}
          }}
        >
          {children}
        </FormContactContext.Provider>
      </Provider>
    );

    render(<ContactForm />, { wrapper });
    expect(IconMock).not.toHaveBeenCalled();
  });

  it("uses onSimpleAction when button is coverage action", () => {
    const handleSimpleAction = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={makeStore()}>
        <FormContactContext.Provider
          value={{
            data: {
              title: "Contacto",
              description: "",
              inputs: [{ name: "document", label: "Doc" }] as any,
              button: { children: "Enviar", identifier: 5 } as any
            },
            getFieldProps: jest.fn(() => ({ onBlur: jest.fn() })) as any,
            setFieldValue: jest.fn(),
            loading: false,
            errors: {},
            values: {},
            onSimpleAction: handleSimpleAction
          }}
        >
          {children}
        </FormContactContext.Provider>
      </Provider>
    );

    render(<ContactForm />, { wrapper });
    const buttonProps = ButtonMock.mock.calls[0][0];
    buttonProps.onClick();
    expect(handleSimpleAction).toHaveBeenCalled();
    expect(buttonProps.type).toBe("button");
  });

  it("renders mobileAfterInputsContent when provided", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={makeStore()}>
        <FormContactContext.Provider
          value={{
            data: {
              title: "Contacto",
              description: "",
              inputs: [{ name: "document", label: "Doc" }] as any,
              button: { children: "Enviar" } as any,
              mobileAfterInputsContent: <div>After</div>
            },
            getFieldProps: jest.fn(() => ({ onBlur: jest.fn() })) as any,
            setFieldValue: jest.fn(),
            loading: false,
            errors: {},
            values: {}
          }}
        >
          {children}
        </FormContactContext.Provider>
      </Provider>
    );

    render(<ContactForm />, { wrapper });
    expect(screen.getByText("After")).toBeInTheDocument();
  });
});
