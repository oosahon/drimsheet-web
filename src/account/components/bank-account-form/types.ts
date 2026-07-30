import type { IBankDirectoryDto, ICurrencyDto } from '@/shared/lib/api/Api';

export interface IBankAccountFormValues {
  name: string;
  currencyCode: string;
  bankLocation: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  createWithoutOpeningBalance: boolean;
  openingBalance: number | '';
  openingDate: string;
  exchangeRate: number | '';
  isSubAccount: boolean;
}

export interface BankAccountFormProps {
  accountingCurrencyCode: string;
  currencies: ICurrencyDto[];
  bankLocations: Array<{ code: string; name: string }>;
  banks: IBankDirectoryDto[];
  isBanksLoading?: boolean;
  onBankLocationChange: (location: string) => void;
  initialValues?: Partial<IBankAccountFormValues>;
  loading?: boolean;
  disabled?: boolean;
  onSubmit: (values: IBankAccountFormValues) => void | Promise<void>;
}
