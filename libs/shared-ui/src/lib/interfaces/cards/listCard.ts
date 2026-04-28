type IListCardClassName = {
  container?: string;
  title?: string;
  list?: string;
  listItem?: string;
  iconWrapper?: string;
  itemText?: string;
};

export interface IListCardProps {
  title: string;
  items: string[];
  className?: IListCardClassName;
}
