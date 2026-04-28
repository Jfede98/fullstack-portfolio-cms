import { usePathname } from "next/navigation";

export const useCustomPathname = () => {
  const path = usePathname();
  return path === "/" ? "home" : path.split("/")[1];
};
