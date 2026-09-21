import { TransferTransactionDetails } from '@/journal-entries/components/transaction-details/parts/transfer-transaction-details';
import type { ITransferTransactionDetails } from '@/journal-entries/lib/types/transaction-details';
import {
  EExchangeRateType,
  EJournalEntrySourceType,
} from '@/shared/lib/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';

const crossCurrencyDetails: ITransferTransactionDetails = {
  attachments: [],
  destinationAccountName: 'Main checking',
  destinationAmount: {
    amount: 1_590_000,
    currencyCode: 'NGN',
    isMinorUnit: false,
  },
  direction: EJournalEntrySourceType.Transfer,
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
  fees: [
    {
      accountId: 'bank-fees',
      accountName: 'International bank transfer fees',
      amount: { amount: 10, currencyCode: 'USD', isMinorUnit: false },
      description: 'Outgoing international transfer charge',
      id: 'line-3',
    },
    {
      accountId: 'correspondent-fees',
      accountName: 'Correspondent bank fees',
      amount: { amount: 5, currencyCode: 'USD', isMinorUnit: false },
      description: null,
      id: 'line-4',
    },
  ],
  kind: 'transfer',
  memo: null,
  sourceAccountName: 'International operations — USD',
  sourceAmount: { amount: 1_000, currencyCode: 'USD', isMinorUnit: false },
};

const meta = {
  title: 'Journal Entries/TransactionDetails/Parts/TransferTransactionDetails',
  component: TransferTransactionDetails,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-md rounded-xl border bg-background px-5">
        <Story />
      </div>
    ),
  ],
  args: { details: crossCurrencyDetails },
} satisfies Meta<typeof TransferTransactionDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CrossCurrencyWithMultipleFees: Story = {};

export const SameCurrencyWithoutFees: Story = {
  args: {
    details: {
      ...crossCurrencyDetails,
      destinationAccountName: 'Tax reserve',
      destinationAmount: {
        amount: 250_000,
        currencyCode: 'NGN',
        isMinorUnit: false,
      },
      exchangeRate: null,
      fees: [],
      sourceAccountName: 'Main checking',
      sourceAmount: {
        amount: 250_000,
        currencyCode: 'NGN',
        isMinorUnit: false,
      },
    },
  },
};
