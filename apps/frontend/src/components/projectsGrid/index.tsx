"use client";

import { useState, useMemo } from "react";
import type { FC } from "react";
import { ProjectCard } from "@sitio-publico/shared-ui";
import type { IProjectsGridProps, CategoryFilterOption } from "@interfaces/components/projectsGrid";
import type { ProjectCategory } from "@sitio-publico/shared-ui";
import { useLocale } from "@context/locale";

const CATEGORY_FILTERS: CategoryFilterOption[] = [
  { value: "all",          labelEs: "Todos",       labelEn: "All" },
  { value: "fullstack",    labelEs: "Fullstack",   labelEn: "Fullstack" },
  { value: "frontend",     labelEs: "Frontend",    labelEn: "Frontend" },
  { value: "backend",      labelEs: "Backend",     labelEn: "Backend" },
  { value: "professional", labelEs: "Profesional", labelEn: "Professional" },
  { value: "academic",     labelEs: "Académico",   labelEn: "Academic" }
];

export const ProjectsGrid: FC<IProjectsGridProps> = ({
  sectionTitle,
  sectionTitleEn,
  sectionSubtitle,
  sectionSubtitleEn,
  projects = [],
  variant = "grid",
  showCategoryFilter = false,
  activeLocale
}) => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "all">("all");

  // Use context locale as primary source; fall back to prop for SSR/testing
  const { locale: contextLocale } = useLocale();
  const isEn = (activeLocale ?? contextLocale) === "en";

  const title = isEn ? (sectionTitleEn || sectionTitle) : sectionTitle;
  const subtitle = isEn ? (sectionSubtitleEn || sectionSubtitle) : sectionSubtitle;

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  // Only show filter options that have at least one project
  const availableFilters = useMemo(() => {
    const presentCategories = new Set(projects.map((p) => p.category));
    return CATEGORY_FILTERS.filter(
      (f) => f.value === "all" || presentCategories.has(f.value as ProjectCategory)
    );
  }, [projects]);

  if (projects.length === 0) return null;

  return (
    <section
      className="w-full py-16 bg-gray-50"
      aria-labelledby="projects-section-title"
      data-testid="projects-grid-section"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        {(title || subtitle) && (
          <div className="text-center mb-10">
            {title && (
              <h2
                id="projects-section-title"
                className="text-3xl font-bold text-gray-900 mb-3"
                data-testid="projects-grid-title"
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className="text-gray-500 text-lg max-w-2xl mx-auto"
                data-testid="projects-grid-subtitle"
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Category filter */}
        {showCategoryFilter && availableFilters.length > 1 && (
          <div
            className="flex flex-wrap justify-center gap-2 mb-10"
            role="group"
            aria-label={isEn ? "Filter by category" : "Filtrar por categoría"}
            data-testid="projects-grid-filter"
          >
            {availableFilters.map((filter) => {
              const isActive = activeCategory === filter.value;
              const label = isEn ? filter.labelEn : filter.labelEs;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveCategory(filter.value)}
                  aria-pressed={isActive}
                  className={[
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    isActive
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Projects grid */}
        {filteredProjects.length > 0 ? (
          <ul
            className={[
              "grid gap-6",
              variant === "featured"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            ].join(" ")}
            aria-label={isEn ? "Projects" : "Proyectos"}
            data-testid="projects-grid-list"
          >
            {filteredProjects.map((project) => {
              const cardTitle = isEn
                ? ((project as any).titleEn || project.title)
                : project.title;
              const cardDesc = isEn
                ? ((project as any).shortDescEn || project.shortDesc)
                : project.shortDesc;

              return (
                <li key={project.id} className="flex">
                  <ProjectCard
                    {...project}
                    title={cardTitle}
                    shortDesc={cardDesc}
                    className={{ container: "w-full" }}
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-center text-gray-400 py-8" data-testid="projects-grid-empty">
            {isEn ? "No projects found." : "No se encontraron proyectos."}
          </p>
        )}
      </div>
    </section>
  );
};
