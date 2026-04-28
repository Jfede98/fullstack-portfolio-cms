import type { TTags } from "@aws/interfaces/utils";

export const DEFAULT_TAGS = (r: string, stage: string): TTags => [
  {
    key: "Project",
    value: "Xtrim Web"
  },
  {
    key: "Environment",
    value: stage
  },
  {
    key: "Resource",
    value: r
  }
];
