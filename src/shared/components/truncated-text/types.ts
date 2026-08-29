import type { ComponentProps } from 'react';

export interface TruncatedTextProps extends Omit<
  ComponentProps<'span'>,
  'children'
> {
  maxLength: number;
  showTooltip?: boolean;
  text: string;
}
