import type { FocusEventHandler } from 'react';

export type UFreeSoloComboboxValue<TOption extends object> =
  | TOption
  | string
  | null;

export interface FreeSoloComboboxProps<TOption extends object> {
  disabled?: boolean;
  emptyMessage?: string;
  error?: Array<{ message?: string } | undefined>;
  getOptionLabel: (option: TOption) => string;
  id: string;
  isOptionEqualToValue?: (option: TOption, value: TOption) => boolean;
  label: string;
  name?: string;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onValueChange: (value: UFreeSoloComboboxValue<TOption>) => void;
  options: TOption[];
  placeholder?: string;
  required?: boolean;
  value: UFreeSoloComboboxValue<TOption>;
}
