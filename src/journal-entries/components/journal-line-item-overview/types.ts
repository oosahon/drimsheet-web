import type { Item } from '@/shared/components/item';
import type {
  IMoneyDto,
  ULedgerAccountBalanceEffect,
} from '@/shared/lib/api/Api';
import type { ComponentProps } from 'react';

export interface JournalLineItemOverviewProps extends Omit<
  ComponentProps<typeof Item>,
  'children'
> {
  categoryName: string;
  effectiveDate: Date;
  amount: IMoneyDto;
  functionalAmount: IMoneyDto;
  balanceEffect: ULedgerAccountBalanceEffect;
  countryCode?: string;
}
