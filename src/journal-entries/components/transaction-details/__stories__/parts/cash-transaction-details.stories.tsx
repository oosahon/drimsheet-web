import { CashTransactionDetails } from '@/journal-entries/components/transaction-details/parts/cash-transaction-details';
import type { ICashTransactionDetails } from '@/journal-entries/lib/types/transaction-details';
import {
  EExchangeRateType,
  EJournalEntrySourceType,
} from '@/shared/lib/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';

const outflowDetails: ICashTransactionDetails = {
  amount: { amount: 1_000, currencyCode: 'USD', isMinorUnit: false },
  attachments: [],
  cashAccountName: 'International operations — United States dollar account',
  categories: [
    {
      accountId: 'gift',
      accountName: 'Community gifts and charitable support',
      amount: { amount: 750, currencyCode: 'USD', isMinorUnit: false },
      description: 'September community outreach programme',
      id: 'line-2',
    },
    {
      accountId: 'donations',
      accountName: 'Emergency relief donations',
      amount: { amount: 250, currencyCode: 'USD', isMinorUnit: false },
      description: null,
      id: 'line-3',
    },
  ],
  counterparties: [
    { id: 'counterparty-1', name: 'Osahon Oboite' },
    { id: 'counterparty-2', name: 'Ada Okafor' },
  ],
  direction: EJournalEntrySourceType.Payment,
  effectiveDate: '2026-09-16T00:00:00Z',
  exchangeRate: {
    asOf: '2026-09-16T00:00:00Z',
    baseCurrencyCode: 'USD',
    createdAt: '2026-09-16T10:00:00Z',
    currencyPair: 'USD/NGN',
    rate: 1590,
    source: 'User supplied',
    targetCurrencyCode: 'NGN',
    type: EExchangeRateType.Negotiated,
  },
  functionalAmount: {
    amount: 1_590_000,
    currencyCode: 'NGN',
    isMinorUnit: false,
  },
  kind: 'cash',
  memo: null,
};

const meta = {
  title: 'Journal Entries/TransactionDetails/Parts/CashTransactionDetails',
  component: CashTransactionDetails,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-md rounded-xl border bg-background px-5">
        <Story />
      </div>
    ),
  ],
  args: { details: outflowDetails },
} satisfies Meta<typeof CashTransactionDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ItemizedOutflowWithConversion: Story = {};

export const Inflow: Story = {
  args: {
    details: {
      ...outflowDetails,
      amount: { amount: 850_000, currencyCode: 'NGN', isMinorUnit: false },
      cashAccountName: 'Main checking',
      categories: [
        {
          accountId: 'services',
          accountName: 'Professional services',
          amount: {
            amount: 850_000,
            currencyCode: 'NGN',
            isMinorUnit: false,
          },
          description: 'Website implementation',
          id: 'line-1',
        },
      ],
      counterparties: [{ id: 'client-1', name: 'Northwind Ltd' }],
      direction: EJournalEntrySourceType.Receipt,
      exchangeRate: null,
      functionalAmount: {
        amount: 850_000,
        currencyCode: 'NGN',
        isMinorUnit: false,
      },
    },
  },
};
