import type { ILedgerAccountDto, IMoneyDto } from '@/shared/lib/api/Api';

export interface IItemizedFieldValue {
  id: string;
  amount: IMoneyDto;
  accountId: string;
  description: string;
}

export interface IItemizedFieldErrors {
  amount?: Array<{ message?: string } | undefined>;
  accountId?: Array<{ message?: string } | undefined>;
  description?: Array<{ message?: string } | undefined>;
}

export interface ItemizedFieldsProps {
  accounts: ILedgerAccountDto[];
  currencyCode: string;
  defaultValue?: IItemizedFieldValue[];
  disabled?: boolean;
  initialEditItemId?: string;
  onChange: (items: IItemizedFieldValue[]) => void;
  onEditModeChange?: (isEditing: boolean) => void;
}
