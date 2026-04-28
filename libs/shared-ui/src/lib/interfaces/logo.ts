type LogoClassName = {
  base?: string;
  fill?: string;
  stroke?: string;
};

type PathColors = {
  primary?: string;
  secondary?: string;
};

export interface ILogoProps {
  width?: string;
  height?: string;
  className?: LogoClassName;
  pathColors?: PathColors;
}
