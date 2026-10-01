import type { FC } from "react";
import clsx from "clsx";
import type { IProjectCardProps } from "@shared-ui/interfaces/cards/projectCard";
import {
  ProjectCardStyle,
  CATEGORY_STYLES,
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  TECH_TAG_STYLES
} from "./style";

export const ProjectCard: FC<IProjectCardProps> = ({
  title,
  shortDesc,
  coverImage,
  coverImageAlt,
  repoUrl,
  liveUrl,
  techStack = [],
  category = "fullstack",
  featured = false,
  className
}) => {
  const {
    container,
    imagePlaceholder,
    image,
    body,
    categoryBadge,
    title: titleStyle,
    description,
    techList,
    techTag,
    actions,
    actionLink
  } = ProjectCardStyle();

  const categoryConfig = CATEGORY_STYLES[category] ?? CATEGORY_STYLES.fullstack;
  const categoryEmoji = CATEGORY_EMOJI[category] ?? "🚀";
  const categoryLabel = CATEGORY_LABEL[category] ?? CATEGORY_LABEL.fullstack;

  return (
    <article
      className={clsx(container(), className?.container)}
      aria-label={title}
      data-testid="project-card"
    >
      {/* Cover image or placeholder */}
      {coverImage ? (
        <img
          src={coverImage}
          alt={coverImageAlt ?? title}
          className={clsx(image(), className?.image)}
          data-testid="project-card-image"
          loading="lazy"
        />
      ) : (
        <div
          className={clsx(
            imagePlaceholder(),
            categoryConfig.placeholder,
            className?.image
          )}
          aria-hidden="true"
          data-testid="project-card-placeholder"
        >
          {categoryEmoji}
        </div>
      )}

      <div className={clsx(body())}>
        {/* Category badge */}
        <span
          className={clsx(categoryBadge(), categoryConfig.badge, className?.category)}
          data-testid="project-card-category"
        >
          <span className="sr-only">Category: </span>
          <span aria-hidden="true">{categoryLabel.es}</span>
          <span className="sr-only"> / {categoryLabel.en}</span>
        </span>

        {/* Title */}
        <h3
          className={clsx(titleStyle(), className?.title)}
          data-testid="project-card-title"
        >
          {featured && (
            <span className="mr-2 text-yellow-400" aria-hidden="true">★</span>
          )}
          {title}
        </h3>

        {/* Description */}
        <p
          className={clsx(description(), className?.description)}
          data-testid="project-card-description"
        >
          {shortDesc}
        </p>

        {/* Tech stack tags */}
        {techStack.length > 0 && (
          <ul
            className={clsx(techList(), className?.techList)}
            aria-label="Tech stack"
            data-testid="project-card-tech-list"
          >
            {techStack.map((tech, idx) => (
              <li
                key={tech.id ?? idx}
                className={clsx(
                  techTag(),
                  TECH_TAG_STYLES[tech.color ?? "gray"]
                )}
              >
                {tech.label}
              </li>
            ))}
          </ul>
        )}

        {/* Action links */}
        {(repoUrl || liveUrl) && (
          <div
            className={clsx(actions(), className?.actions)}
            data-testid="project-card-actions"
          >
            {repoUrl && (
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(actionLink(), "text-gray-600 hover:text-gray-900")}
                aria-label={`Ver repositorio de ${title}`}
                data-testid="project-card-repo-link"
              >
                {/* GitHub icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>Repositorio</span>
              </a>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(actionLink(), "text-blue-600 hover:text-blue-800")}
                aria-label={`Ver demo en vivo de ${title}`}
                data-testid="project-card-live-link"
              >
                {/* External link icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                <span>Demo</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
