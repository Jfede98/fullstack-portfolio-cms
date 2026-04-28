import { renderHook } from "@testing-library/react";
import { useAppDispatch, useAppSelector } from "@store/semiautomaticFlow/hooks";
import { Provider } from "react-redux";
import { makeStore } from "@store/semiautomaticFlow";

describe("store/semiautomaticFlow/hooks", () => {
  it("provides typed dispatch and selector", () => {
    const store = makeStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result: dispatchResult } = renderHook(() => useAppDispatch(), { wrapper });
    expect(typeof dispatchResult.current).toBe("function");

    const { result: selectorResult } = renderHook(
      () => useAppSelector((state) => state.semiautomaticFlow.coverageCompleted),
      { wrapper }
    );
    expect(selectorResult.current).toBe(false);
  });
});
