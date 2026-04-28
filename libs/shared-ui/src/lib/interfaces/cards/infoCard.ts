type IInfoCardClassName = {
  container?: string;
  image?: string;
  title?: string;
  description?: string;
};

export interface IInfoCardProps {
  image?: string;
  imageAlt?: string;
  title: string;
  description: string;
  className?: IInfoCardClassName;
}
