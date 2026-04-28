import { describe, it, expect, vi } from "vitest";
import { mergeRefs } from "../../lib/helpers/global";

describe("mergeRefs", () => {
  it("assigns value to object refs", () => {
    const ref1 = { current: null as HTMLDivElement | null };
    const ref2 = { current: null as HTMLDivElement | null };

    const mergedRef = mergeRefs<HTMLDivElement>(ref1, ref2);
    const div = document.createElement("div");

    mergedRef(div);

    expect(ref1.current).toBe(div);
    expect(ref2.current).toBe(div);
  });

  it("calls function refs with the value", () => {
    const refFn1 = vi.fn();
    const refFn2 = vi.fn();

    const mergedRef = mergeRefs<HTMLDivElement>(refFn1, refFn2);
    const div = document.createElement("div");

    mergedRef(div);

    expect(refFn1).toHaveBeenCalledWith(div);
    expect(refFn2).toHaveBeenCalledWith(div);
  });

  it("supports mixed object and function refs", () => {
    const refObj = { current: null as HTMLDivElement | null };
    const refFn = vi.fn();

    const mergedRef = mergeRefs<HTMLDivElement>(refObj, refFn);
    const div = document.createElement("div");

    mergedRef(div);

    expect(refObj.current).toBe(div);
    expect(refFn).toHaveBeenCalledWith(div);
  });

  it("ignores undefined refs", () => {
    const refObj = { current: null as HTMLDivElement | null };
    const refFn = vi.fn();

    const mergedRef = mergeRefs<HTMLDivElement>(
      undefined,
      refObj,
      undefined,
      refFn
    );

    const div = document.createElement("div");
    mergedRef(div);

    expect(refObj.current).toBe(div);
    expect(refFn).toHaveBeenCalledWith(div);
  });
});
