import { describe, it, expect } from "vitest";
import meta, {
  Default,
  Simple,
  NoItems,
  None
} from "../../../stories/menus/footer.stories";

describe("Footer stories — variant configuration", () => {
  describe("Default story", () => {
    it("has footerVariant set to 'default'", () => {
      expect(Default.args?.footerVariant).toBe("default");
    });

    it("includes corporate contact info", () => {
      expect(Default.args?.info).toBeDefined();
      expect(Array.isArray(Default.args?.info?.items)).toBe(true);
      expect(Default.args?.info?.items?.length).toBeGreaterThan(0);
    });

    it("includes social networks", () => {
      expect(Array.isArray(Default.args?.socialNetworks)).toBe(true);
      expect(Default.args?.socialNetworks?.length).toBeGreaterThan(0);
    });

    it("includes navigation link columns", () => {
      expect(Array.isArray(Default.args?.links)).toBe(true);
      expect(Default.args?.links?.length).toBeGreaterThan(0);
    });

    it("includes linkRegulatorios", () => {
      expect(Default.args?.linkRegulatorios).toBeDefined();
      expect(Default.args?.linkRegulatorios?.href).toBeTruthy();
    });

    it("includes linkPolicies", () => {
      expect(Default.args?.linkPolicies).toBeDefined();
      expect(Default.args?.linkPolicies?.href).toBeTruthy();
    });

    it("has a story description in parameters", () => {
      expect(Default.parameters?.docs?.description?.story).toBeTruthy();
    });
  });

  describe("Simple story", () => {
    it("has footerVariant set to 'simple'", () => {
      expect(Simple.args?.footerVariant).toBe("simple");
    });

    it("does not include navigation links", () => {
      expect(Simple.args?.links).toBeUndefined();
    });

    it("does not include social networks", () => {
      expect(Simple.args?.socialNetworks).toBeUndefined();
    });

    it("does not include corporate info", () => {
      expect(Simple.args?.info).toBeUndefined();
    });

    it("has a story description in parameters", () => {
      expect(Simple.parameters?.docs?.description?.story).toBeTruthy();
    });
  });

  describe("NoItems story", () => {
    it("has footerVariant set to 'no_items'", () => {
      expect(NoItems.args?.footerVariant).toBe("no_items");
    });

    it("includes linkPolicies for the copyright", () => {
      expect(NoItems.args?.linkPolicies).toBeDefined();
      expect(NoItems.args?.linkPolicies?.href).toBeTruthy();
      expect(NoItems.args?.linkPolicies?.label).toBeTruthy();
    });

    it("does not include navigation links", () => {
      expect(NoItems.args?.links).toBeUndefined();
    });

    it("does not include social networks", () => {
      expect(NoItems.args?.socialNetworks).toBeUndefined();
    });

    it("does not include corporate info", () => {
      expect(NoItems.args?.info).toBeUndefined();
    });

    it("has a story description in parameters", () => {
      expect(NoItems.parameters?.docs?.description?.story).toBeTruthy();
    });
  });

  describe("None story", () => {
    it("has footerVariant set to 'none'", () => {
      expect(None.args?.footerVariant).toBe("none");
    });

    it("has a story description in parameters", () => {
      expect(None.parameters?.docs?.description?.story).toBeTruthy();
    });
  });

  describe("meta — footerVariant argTypes", () => {
    it("defines footerVariant as a select control", () => {
      expect((meta.argTypes as any)?.footerVariant?.control?.type).toBe("select");
    });

    it("includes all four variant options", () => {
      const options = (meta.argTypes as any)?.footerVariant?.options;
      expect(options).toContain("default");
      expect(options).toContain("simple");
      expect(options).toContain("no_items");
      expect(options).toContain("none");
    });

    it("is categorised under 'Behavior'", () => {
      expect((meta.argTypes as any)?.footerVariant?.table?.category).toBe("Behavior");
    });

    it("has a prop description", () => {
      expect((meta.argTypes as any)?.footerVariant?.description).toBeTruthy();
    });
  });

  describe("meta — global configuration", () => {
    it("points to the Footer component", () => {
      expect(meta.component).toBeDefined();
    });

    it("has the correct title", () => {
      expect(meta.title).toBe("Menu/Footer");
    });

    it("has fullscreen layout", () => {
      expect(meta.parameters?.layout).toBe("fullscreen");
    });

    it("has a component description in docs", () => {
      expect(meta.parameters?.docs?.description?.component).toBeTruthy();
    });
  });
});
