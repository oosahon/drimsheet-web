import { CashTransactionForm } from '@/journal-entries/components/cash-transaction-form';
import type {
  IExchangeRate,
  IJournalCounterpartyReq,
  ILedgerAccountDto,
} from '@/shared/lib/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';

const accounts = [
  {
    id: 'ngn-bank',
    code: '1000',
    name: 'Main bank account',
    type: 'asset',
    balance: { amount: 0, currencyCode: 'NGN', isMinorUnit: false },
  },
  {
    id: 'usd-bank',
    code: '1010',
    name: 'USD bank account',
    type: 'asset',
    balance: { amount: 0, currencyCode: 'USD', isMinorUnit: false },
  },
] as unknown as ILedgerAccountDto[];

const categories = [
  {
    id: 'sales',
    code: '4000',
    name: 'Sales revenue',
    type: 'revenue',
    balance: { amount: 0, currencyCode: 'NGN', isMinorUnit: false },
  },
] as unknown as ILedgerAccountDto[];

const counterpartyOptions: IJournalCounterpartyReq[] = [
  { id: 'counterparty-1', name: 'Acme Consulting', type: 'organization' },
  { id: 'counterparty-2', name: 'Jordan Taylor', type: 'individual' },
];

const meta = {
  title: 'Journal Entries/CashTransactionForm',
  component: CashTransactionForm,
  tags: ['autodocs'],
  args: {
    accounts,
    categories,
    counterpartyOptions,
    functionalCurrencyCode: 'NGN',
    onCurrencyContextChange: () => undefined,
    onSubmit: () => undefined,
  },
} satisfies Meta<typeof CashTransactionForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ScreenshotLayout: Story = {};

export const InflowCounterpartyText: Story = {
  args: {
    variant: 'inflow',
  },
};

export const OutflowCounterpartyText: Story = {
  args: {
    variant: 'outflow',
  },
};

export const ForeignCurrencyAccount: Story = {
  args: {
    initialValues: {
      accountId: 'usd-bank',
      categoryId: 'sales',
      amount: { amount: 1250 },
      exchangeRate: '1500',
      counterparty: counterpartyOptions[0],
      description: 'August consulting retainer',
    },
    officialExchangeRate: {
      baseCurrencyCode: 'USD',
      targetCurrencyCode: 'NGN',
      rate: 1500,
      asOf: new Date().toISOString(),
    } as IExchangeRate,
  },
};

export const Itemized: Story = {
  args: {
    initialValues: {
      accountId: 'ngn-bank',
      amount: { amount: 125000 },
      isItemized: true,
      items: [
        {
          id: 'story-item-1',
          amount: {
            amount: 125000,
            currencyCode: 'NGN',
            isMinorUnit: false,
          },
          accountId: 'sales',
          description: '',
        },
      ],
      counterparty: counterpartyOptions[0],
    },
  },
};

export const FunctionalCurrencyAccount: Story = {
  args: {
    initialValues: {
      accountId: 'ngn-bank',
      categoryId: 'sales',
      amount: { amount: 125000 },
      counterparty: counterpartyOptions[1],
    },
  },
};

export const NarrowViewport: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};
