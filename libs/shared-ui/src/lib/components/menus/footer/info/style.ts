import { tv } from "tailwind-variants";

export const FooterInfoStyle = tv({
  slots: {
    containerAddress: ["block"],
    addressStyle: ["xl:block", "text-white!", "text-body", "font-light"],
    containerInfo: ["hidden", "xl:flex", "flex-col", "gap-3"]
  }
});
