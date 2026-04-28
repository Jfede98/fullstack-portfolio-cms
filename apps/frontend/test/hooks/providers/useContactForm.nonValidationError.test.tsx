import { renderHook, act } from "@testing-library/react";
import React from "react";
import { ModalContext } from "@context/modal";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() })
}));

jest.mock("@store/semiautomaticFlow/hooks", () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: jest.fn(() => null)
}));

jest.mock("@store/semiautomaticFlow", () => ({
  setLeadData: (data: unknown) => ({ type: "setLeadData", payload: data }),
  setSelectedPlan: (plan: unknown) => ({ type: "setSelectedPlan", payload: plan })
}));

jest.mock("@hooks/useCustomPathname", () => ({
  useCustomPathname: () => "home"
}));

jest.mock("@hooks/useGtm", () => ({
  useGtm: () => ({ addEvent: jest.fn() })
}));

jest.mock("@sitio-publico/shared-ui", () => ({
  useMatchMedia: () => ({ isDesktop: true })
}));

jest.mock("@lib/utils/utms", () => ({
  getUtmSource: () => ({ utm_source: "test" })
}));

jest.mock("@lib/api/leads/assisted", () => ({
  sendAssistedLead: jest.fn()
}));

jest.mock("@lib/api/leads/distribution", () => ({
  dispatchLeadEmail: jest.fn()
}));

jest.mock("@tanstack/react-query", () => ({
  useMutation: () => ({
    mutateAsync: jest.fn(),
    isPending: false
  })
}));

jest.mock("yup", () => {
  const actual = jest.requireActual("yup");
  return {
    ...actual,
    object: jest.fn(() => ({
      validate: jest.fn().mockRejectedValue(new Error("non-validation-error"))
    }))
  };
});

describe("useContactForm validate fallback", () => {
  it("returns empty errors when schema throws non ValidationError", async () => {
    const handlerState = jest.fn();
    const handlerModalType = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ModalContext.Provider
        value={{ state: false, handlerState, handlerModalType }}
      >
        {children}
      </ModalContext.Provider>
    );

    const { useContactForm } = await import("@hooks/providers/useContactForm");
    const { result } = renderHook(() => useContactForm(), { wrapper });

    await act(async () => {
      const errors = await result.current.validateForm();
      expect(errors).toEqual({});
    });
  });
});
