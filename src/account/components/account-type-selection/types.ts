import type { ULedgerAccountBehavior } from '@/shared/lib/api/Api';
import type { ReactNode } from 'react';

export interface IAccountTypeOption {
  value: ULedgerAccountBehavior;
  label: string;
  description: string;
  icon?: ReactNode;
}

export interface AccountTypeSelectionProps {
  defaultValue?: ULedgerAccountBehavior;
  value?: ULedgerAccountBehavior;
  onChange?: (value: ULedgerAccountBehavior) => void;
  onSubmit?: (value: ULedgerAccountBehavior) => void;
  disabled?: boolean;
  className?: string;
}
