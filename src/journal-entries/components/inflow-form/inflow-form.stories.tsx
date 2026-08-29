import { InflowForm } from '@/journal-entries/components/inflow-form';
import type {
  IExchangeRate,
  IJournalCounterpartyReq,
  ILedgerAccountDto,
} from '@/shared/lib/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';

const destinationAccounts = [
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

const sourceAccounts = [
  {
    id: 'sales',
    code: '4000',
    name: 'Sales revenue',
    type: 'revenue',
    balance: { amount: 0, currencyCode: 'NGN', isMinorUnit: false },
  },
] as unknown as ILedgerAccountDto[];

const payerOptions: IJournalCounterpartyReq[] = [
  { id: 'payer-1', name: 'Acme Consulting', type: 'organization' },
  { id: 'payer-2', name: 'Jordan Taylor', type: 'individual' },
];

const meta = {
  title: 'Journal Entries/InflowForm',
  component: InflowForm,
  tags: ['autodocs'],
  args: {
    destinationAccounts,
    functionalCurrencyCode: 'NGN',
    onCurrencyContextChange: () => undefined,
    onSubmit: () => undefined,
    payerOptions,
    sourceAccounts,
  },
} satisfies Meta<typeof InflowForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ScreenshotLayout: Story = {};

export const ForeignCurrencyAccount: Story = {
  args: {
    initialValues: {
      destinationAccountId: 'usd-bank',
      sourceAccountId: 'sales',
      amount: { amount: 1250 },
      exchangeRate: '1500',
      payer: payerOptions[0],
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
      destinationAccountId: 'ngn-bank',
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
      payer: payerOptions[0],
    },
  },
};

export const FunctionalCurrencyAccount: Story = {
  args: {
    initialValues: {
      destinationAccountId: 'ngn-bank',
      sourceAccountId: 'sales',
      amount: { amount: 125000 },
      payer: payerOptions[1],
    },
  },
};

export const NarrowViewport: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};
