import type { MutableRefObject, Ref } from "react";

export const mergeRefs = <T>(...refs: Array<Ref<T> | undefined>) => {
  return (value: T) => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        ref(value);
      } else {
        (ref as MutableRefObject<T | null>).current = value;
      }
    });
  };
};