import type { UCounterpartyRole } from '@/shared/lib/api/Api';
import type { ReactNode } from 'react';

export type UCounterpartyRoleSelectValue = UCounterpartyRole | 'default';

export interface ICounterpartyRoleOption {
  value: UCounterpartyRoleSelectValue;
  label: string;
  description: string;
  icon?: ReactNode;
}

export interface CounterpartyRoleSelectProps {
  defaultValue?: UCounterpartyRoleSelectValue;
  value?: UCounterpartyRoleSelectValue;
  onSubmit: (value: UCounterpartyRoleSelectValue) => void;
  disabled?: boolean;
  className?: string;
}
