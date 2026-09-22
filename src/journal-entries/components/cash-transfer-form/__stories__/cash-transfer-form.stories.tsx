import { CashTransferForm } from '@/journal-entries/components/cash-transfer-form';
import type { ILedgerAccountDto } from '@/shared/lib/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';

const sourceAccounts = [
  {
    id: 'source-bank',
    code: '1000',
    name: 'Operating account',
    type: 'asset',
    subType: 'cash_and_cash_equivalent',
    balance: { amount: 0, currencyCode: 'NGN', isMinorUnit: false },
  },
  {
    id: 'source-usd',
    code: '1001',
    name: 'USD operating account',
    type: 'asset',
    subType: 'cash_and_cash_equivalent',
    balance: { amount: 0, currencyCode: 'USD', isMinorUnit: false },
  },
] as ILedgerAccountDto[];

const destinationAccounts = [
  {
    id: 'destination-cash',
    code: '1010',
    name: 'Petty cash',
    type: 'asset',
    subType: 'cash_and_cash_equivalent',
    balance: { amount: 0, currencyCode: 'NGN', isMinorUnit: false },
  },
  {
    id: 'destination-usd',
    code: '1020',
    name: 'USD account',
    type: 'asset',
    subType: 'cash_and_cash_equivalent',
    balance: { amount: 0, currencyCode: 'USD', isMinorUnit: false },
  },
] as ILedgerAccountDto[];

const categories = [
  {
    id: 'bank-fees',
    code: '6000',
    name: 'Bank fees',
    type: 'expense',
    subType: 'bank_charge',
    balance: { amount: 0, currencyCode: 'NGN', isMinorUnit: false },
  },
] as ILedgerAccountDto[];

const meta = {
  title: 'Journal Entries/CashTransferForm',
  component: CashTransferForm,
  tags: ['autodocs'],
  args: {
    sourceAccounts,
    destinationAccounts,
    categories,
    functionalCurrencyCode: 'NGN',
    onCurrencyContextChange: () => undefined,
    onSaveDraft: () => undefined,
    onSubmit: () => undefined,
  },
} satisfies Meta<typeof CashTransferForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithChargesAndFees: Story = {
  args: {
    initialValues: {
      sourceAccountId: 'source-bank',
      destinationAccountId: 'destination-cash',
      amountSent: { amount: 102500 },
      amountReceived: { amount: 100000 },
      isItemized: true,
      items: [
        {
          id: 'fee-1',
          amount: { amount: 2500, currencyCode: 'NGN', isMinorUnit: false },
          accountId: 'bank-fees',
          description: 'Transfer fee',
        },
      ],
      description: 'Fund petty cash',
    },
  },
};

export const ForeignCurrency: Story = {
  args: {
    initialValues: {
      sourceAccountId: 'source-usd',
      destinationAccountId: 'destination-cash',
      amountSent: { amount: 100 },
      amountReceived: { amount: 150000 },
      exchangeRate: { value: 1500, inverted: false },
    },
    officialExchangeRate: {
      currencyPair: 'USD/NGN',
      baseCurrencyCode: 'USD',
      targetCurrencyCode: 'NGN',
      rate: 1500,
      type: 'official',
      asOf: new Date().toISOString(),
      source: 'Central bank',
      createdAt: new Date().toISOString(),
    },
  },
};

export const Loading: Story = {
  args: { loading: true },
};

export const NarrowViewport: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
