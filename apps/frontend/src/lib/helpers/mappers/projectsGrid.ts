import { mapUrlMedia } from "./utils";
import type { IProjectsGridProps } from "@interfaces/components/projectsGrid";
import type { ITechTag, TechTagColor, ProjectCategory } from "@sitio-publico/shared-ui";

const VALID_COLORS: TechTagColor[] = [
  "blue", "green", "orange", "purple", "pink", "gray", "red", "yellow"
];

const toTechTagColor = (color?: string): TechTagColor =>
  VALID_COLORS.includes(color as TechTagColor) ? (color as TechTagColor) : "gray";

const VALID_CATEGORIES: ProjectCategory[] = [
  "frontend", "backend", "fullstack", "professional", "academic"
];

const toProjectCategory = (category?: string): ProjectCategory =>
  VALID_CATEGORIES.includes(category as ProjectCategory)
    ? (category as ProjectCategory)
    : "fullstack";

export const mapProjectsGrid = (data: any): IProjectsGridProps => {
  const projects = (data?.projects ?? []).map((project: any) => {
    const techStack: ITechTag[] = (project.techStack ?? []).map(
      (tag: any): ITechTag => ({
        id: tag.id,
        label: tag.label ?? "",
        color: toTechTagColor(tag.color)
      })
    );

    return {
      id: project.id,
      slug: project.slug,
      title: project.title ?? "",
      titleEn: project.titleEn,
      shortDesc: project.shortDesc ?? "",
      shortDescEn: project.shortDescEn,
      longDesc: project.longDesc,
      longDescEn: project.longDescEn,
      coverImage: mapUrlMedia(project.coverImage),
      coverImageAlt: project.coverImage?.alternativeText || project.title,
      repoUrl: project.repoUrl,
      liveUrl: project.liveUrl,
      techStack,
      category: toProjectCategory(project.category),
      featured: project.featured ?? false,
      status: project.status ?? "live"
    };
  });

  return {
    id: data?.id,
    sectionTitle: data?.sectionTitle,
    sectionTitleEn: data?.sectionTitleEn,
    sectionSubtitle: data?.sectionSubtitle,
    sectionSubtitleEn: data?.sectionSubtitleEn,
    projects,
    variant: data?.variant ?? "grid",
    showCategoryFilter: data?.showCategoryFilter ?? false
  };
};
