import { describe, it, expect } from "vitest";
import meta, {
  Default,
  Simple,
  NoItems,
  None
} from "../../../stories/menus/navbar.stories";

describe("Navbar stories — variant configuration", () => {
  describe("Default story", () => {
    it("has navbarVariant set to 'default'", () => {
      expect(Default.args?.navbarVariant).toBe("default");
    });

    it("includes sessionLink", () => {
      expect(Default.args?.sessionLink).toBeDefined();
      expect(Default.args?.sessionLink?.href).toBe("#");
    });

    it("includes buttonContact", () => {
      expect(Default.args?.buttonContact).toBeDefined();
      expect(Default.args?.buttonContact?.children).toBe("Contratar");
    });

    it("includes navbarTop with at least two items", () => {
      expect(Array.isArray(Default.args?.navbarTop)).toBe(true);
      expect(Default.args?.navbarTop?.length).toBeGreaterThanOrEqual(2);
    });

    it("includes navigation links", () => {
      expect(Array.isArray(Default.args?.links)).toBe(true);
      expect(Default.args?.links?.length).toBeGreaterThan(0);
    });

    it("has a story description in parameters", () => {
      expect(Default.parameters?.docs?.description?.story).toBeTruthy();
    });
  });

  describe("Simple story", () => {
    it("has navbarVariant set to 'simple'", () => {
      expect(Simple.args?.navbarVariant).toBe("simple");
    });

    it("does not include navigation links", () => {
      expect(Simple.args?.links).toBeUndefined();
    });

    it("does not include buttonContact", () => {
      expect(Simple.args?.buttonContact).toBeUndefined();
    });

    it("has a story description in parameters", () => {
      expect(Simple.parameters?.docs?.description?.story).toBeTruthy();
    });
  });

  describe("NoItems story", () => {
    it("has navbarVariant set to 'no_items'", () => {
      expect(NoItems.args?.navbarVariant).toBe("no_items");
    });

    it("does not include navigation links", () => {
      expect(NoItems.args?.links).toBeUndefined();
    });

    it("does not include navbarTop", () => {
      expect(NoItems.args?.navbarTop).toBeUndefined();
    });

    it("has a story description in parameters", () => {
      expect(NoItems.parameters?.docs?.description?.story).toBeTruthy();
    });
  });

  describe("None story", () => {
    it("has navbarVariant set to 'none'", () => {
      expect(None.args?.navbarVariant).toBe("none");
    });

    it("has a story description in parameters", () => {
      expect(None.parameters?.docs?.description?.story).toBeTruthy();
    });
  });

  describe("meta — navbarVariant argTypes", () => {
    it("defines navbarVariant as a select control", () => {
      expect((meta.argTypes as any)?.navbarVariant?.control?.type).toBe("select");
    });

    it("includes all four variant options", () => {
      const options = (meta.argTypes as any)?.navbarVariant?.options;
      expect(options).toContain("default");
      expect(options).toContain("simple");
      expect(options).toContain("no_items");
      expect(options).toContain("none");
    });

    it("is categorised under 'Behavior'", () => {
      expect((meta.argTypes as any)?.navbarVariant?.table?.category).toBe("Behavior");
    });

    it("has a prop description", () => {
      expect((meta.argTypes as any)?.navbarVariant?.description).toBeTruthy();
    });
  });

  describe("meta — global configuration", () => {
    it("points to the Navbar component", () => {
      expect(meta.component).toBeDefined();
    });

    it("has the correct title", () => {
      expect(meta.title).toBe("Menu/Navbar");
    });

    it("has fullscreen layout", () => {
      expect(meta.parameters?.layout).toBe("fullscreen");
    });

    it("has a component description in docs", () => {
      expect(meta.parameters?.docs?.description?.component).toBeTruthy();
    });
  });
});
