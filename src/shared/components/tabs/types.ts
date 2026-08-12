export interface ITabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  items: ITabItem[];
  value: string;
  onValueChange: (value: string) => void;
  ariaLabel: string;
}
