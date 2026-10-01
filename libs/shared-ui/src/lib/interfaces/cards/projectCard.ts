export type TechTagColor =
  | "blue"
  | "green"
  | "orange"
  | "purple"
  | "pink"
  | "gray"
  | "red"
  | "yellow";

export type ProjectCategory =
  | "frontend"
  | "backend"
  | "fullstack"
  | "professional"
  | "academic";

export interface ITechTag {
  id?: number;
  label: string;
  color?: TechTagColor;
}

export interface IProjectCardClassName {
  container?: string;
  image?: string;
  category?: string;
  title?: string;
  description?: string;
  techList?: string;
  actions?: string;
}

export interface IProjectCardProps {
  id?: number;
  title: string;
  shortDesc: string;
  coverImage?: string;
  coverImageAlt?: string;
  repoUrl?: string;
  liveUrl?: string;
  techStack?: ITechTag[];
  category?: ProjectCategory;
  featured?: boolean;
  className?: IProjectCardClassName;
}
