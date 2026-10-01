import type { IProjectCardProps, ProjectCategory } from "@sitio-publico/shared-ui";

export type ProjectsGridVariant = "grid" | "featured";

export interface IProjectsGridProject extends IProjectCardProps {
  id: number;
  slug?: string;
  longDesc?: string;
  longDescEn?: string;
}

export interface IProjectsGridProps {
  id?: number;
  sectionTitle?: string;
  sectionTitleEn?: string;
  sectionSubtitle?: string;
  sectionSubtitleEn?: string;
  projects?: IProjectsGridProject[];
  variant?: ProjectsGridVariant;
  showCategoryFilter?: boolean;
  activeLocale?: "es" | "en";
}

export type CategoryFilterOption = {
  value: ProjectCategory | "all";
  labelEs: string;
  labelEn: string;
};
