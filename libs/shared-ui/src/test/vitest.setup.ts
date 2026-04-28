import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { LRUCache } from 'lru-cache';

if (typeof (globalThis as any).LRUCache === 'undefined') {
  // @ts-expect-error LRU
  globalThis.LRUCache = LRUCache;
}

afterEach(() => {
  cleanup();
});