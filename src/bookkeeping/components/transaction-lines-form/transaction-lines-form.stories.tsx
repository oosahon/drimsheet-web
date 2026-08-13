import {
  ELedgerAccountStatus,
  ELedgerType,
  type ICurrencyDto,
  type ILedgerAccountDto,
  type TEntityId,
  type UAdjunctAccountRule,
  type UContraAccountRule,
  type UNormalBalance,
} from '@/shared/lib/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  TransactionLinesForm,
  TransactionLinesFormDialog,
} from './transaction-lines-form';

const mockCurrencies: ICurrencyDto[] = [
  { code: 'NGN', symbol: 'N', name: 'Nigerian Naira', minorUnit: 2 },
  { code: 'USD', symbol: '$', name: 'United States Dollar', minorUnit: 2 },
  { code: 'GBP', symbol: 'GBP', name: 'Pound Sterling', minorUnit: 2 },
];

const createAccount = (
  overrides: Pick<ILedgerAccountDto, 'id' | 'code' | 'name'> &
    Partial<ILedgerAccountDto>
): ILedgerAccountDto => {
  const baseAccount: ILedgerAccountDto = {
    id: 'account-id' as TEntityId,
    code: '1000',
    name: 'Account',
    type: ELedgerType.Asset,
    normalBalance: 'debit' as UNormalBalance,
    subType: 'cash_and_cash_equivalent',
    behavior: 'bank',
    isControlAccount: false,
    status: ELedgerAccountStatus.Active,
    contraAccountRule: 'contra_not_applicable' as UContraAccountRule,
    adjunctAccountRule: 'adjunct_not_applicable' as UAdjunctAccountRule,
    balance: { amount: 150000, currencyCode: 'NGN', isMinorUnit: false },
    functionalBalance: {
      amount: 150000,
      currencyCode: 'NGN',
      isMinorUnit: false,
    },
    createdAt: '2026-05-01T08:00:00Z',
    updatedAt: '2026-05-01T08:00:00Z',
    createdBy: 'user-1' as TEntityId,
    materializedPath: '',
    accountingEntityId: 'entity-1' as TEntityId,
    openingBalanceDate: null,
  };

  return { ...baseAccount, ...overrides };
};

const mockAccounts: ILedgerAccountDto[] = [
  createAccount({
    id: 'main-account' as TEntityId,
    code: '1000',
    name: 'Main Bank Account',
  }),
  createAccount({
    id: 'petty-cash' as TEntityId,
    code: '1010',
    name: 'Petty Cash Vault',
    behavior: 'petty_cash',
  }),
  createAccount({
    id: 'usd-account' as TEntityId,
    code: '1100',
    name: 'USD Operating Account',
    balance: { amount: 12000, currencyCode: 'USD', isMinorUnit: false },
    functionalBalance: {
      amount: 18480000,
      currencyCode: 'NGN',
      isMinorUnit: false,
    },
  }),
];

const createStoryQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
    },
  });

  queryClient.setQueryData(['currencyService.getAll'], mockCurrencies);

  return queryClient;
};

const meta = {
  title: 'Bookkeeping/TransactionLinesForm',
  component: TransactionLinesForm,
  decorators: [
    (Story) => (
      <QueryClientProvider client={createStoryQueryClient()}>
        <div className="p-4 max-w-sm mx-auto">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    accounts: mockAccounts,
    defaultValue: [],
    onSubmit: () => {},
    onCancel: () => {},
  },
  argTypes: {
    onSubmit: { action: 'submitted' },
    onCancel: { action: 'cancelled' },
  },
} satisfies Meta<typeof TransactionLinesForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithExistingLines: Story = {
  args: {
    defaultValue: [
      {
        accountId: 'main-account',
        amount: 125000,
        currency: 'NGN',
      },
      {
        accountId: 'usd-account',
        amount: 3200,
        currency: 'USD',
      },
    ],
  },
};

export const InDialog: Story = {
  args: {
    defaultValue: [
      {
        accountId: 'petty-cash',
        amount: 50000,
        currency: 'NGN',
      },
    ],
  },
  render: (args) => (
    <TransactionLinesFormDialog
      {...args}
      open
      title="Edit transaction lines"
      onClose={() => {}}
    />
  ),
};
