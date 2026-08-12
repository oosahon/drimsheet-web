import type { ReactNode } from 'react';

export interface IEntryOverviewMenuItem {
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
  variant?: 'default' | 'destructive';
}

export interface EntryOverviewProps {
  title: string;
  subtitle?: string;
  amount: string;
  menuItems: IEntryOverviewMenuItem[];
}
