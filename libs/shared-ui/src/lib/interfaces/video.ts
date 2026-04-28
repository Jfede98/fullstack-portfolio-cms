export interface IVideoProps {
  url: string;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  className?: IVideoClassName;
}

export type IVideoClassName = {
  wrapper?: string;
}
