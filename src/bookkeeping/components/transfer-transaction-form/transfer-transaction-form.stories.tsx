import '@/_app/i18n/config';
import {
  ELedgerAccountStatus,
  ELedgerType,
  type ILedgerAccountDto,
  type TEntityId,
  type UAdjunctAccountRule,
  type UContraAccountRule,
  type UNormalBalance,
} from '@/shared/lib/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { TransferTransactionForm } from './transfer-transaction-form';

const mockAccounts: ILedgerAccountDto[] = [
  {
    id: '1' as TEntityId,
    code: '1000',
    name: 'Main Bank Account',
    type: ELedgerType.Asset,
    normalBalance: 'debit' as UNormalBalance,
    subType: 'cash_and_cash_equivalent',
    behavior: 'bank',
    isControlAccount: true,
    status: ELedgerAccountStatus.Active,
    contraAccountRule: 'contra_not_applicable' as UContraAccountRule,
    adjunctAccountRule: 'adjunct_not_applicable' as UAdjunctAccountRule,
    balance: { amount: 1500000, currencyCode: 'NGN', isMinorUnit: false },
    functionalBalance: {
      amount: 1500000,
      currencyCode: 'NGN',
      isMinorUnit: false,
    },
    createdAt: '2026-05-01T08:00:00Z',
    updatedAt: '2026-05-01T08:00:00Z',
    createdBy: 'user-1' as TEntityId,
    materializedPath: '',
    accountingEntityId: 'entity-1' as TEntityId,
  },
  {
    id: '2' as TEntityId,
    code: '1010',
    name: 'Petty Cash Vault',
    type: ELedgerType.Asset,
    normalBalance: 'debit' as UNormalBalance,
    subType: 'cash_and_cash_equivalent',
    behavior: 'petty_cash',
    isControlAccount: false,
    status: ELedgerAccountStatus.Active,
    contraAccountRule: 'contra_not_applicable' as UContraAccountRule,
    adjunctAccountRule: 'adjunct_not_applicable' as UAdjunctAccountRule,
    balance: { amount: 250000, currencyCode: 'NGN', isMinorUnit: false },
    functionalBalance: {
      amount: 250000,
      currencyCode: 'NGN',
      isMinorUnit: false,
    },
    createdAt: '2026-05-03T09:30:00Z',
    updatedAt: '2026-05-03T09:30:00Z',
    createdBy: 'user-1' as TEntityId,
    materializedPath: '',
    accountingEntityId: 'entity-1' as TEntityId,
  },
  {
    id: '3' as TEntityId,
    code: '1100',
    name: 'USD Operating Account',
    type: ELedgerType.Asset,
    normalBalance: 'debit' as UNormalBalance,
    subType: 'cash_and_cash_equivalent',
    behavior: 'bank',
    isControlAccount: false,
    status: ELedgerAccountStatus.Active,
    contraAccountRule: 'contra_not_applicable' as UContraAccountRule,
    adjunctAccountRule: 'adjunct_not_applicable' as UAdjunctAccountRule,
    balance: { amount: 12000, currencyCode: 'USD', isMinorUnit: false },
    functionalBalance: {
      amount: 18480000,
      currencyCode: 'NGN',
      isMinorUnit: false,
    },
    createdAt: '2026-05-10T12:30:00Z',
    updatedAt: '2026-05-10T12:30:00Z',
    createdBy: 'user-1' as TEntityId,
    materializedPath: '',
    accountingEntityId: 'entity-1' as TEntityId,
  },
];

const meta = {
  title: 'Bookkeeping/TransferTransactionForm',
  component: TransferTransactionForm,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="mx-auto max-w-md p-4">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    accounts: mockAccounts,
    onSubmit: () => {},
  },
  argTypes: {
    onSubmit: { action: 'submitted' },
  },
} satisfies Meta<typeof TransferTransactionForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const FromAccountContext: Story = {
  args: {
    loading: false,
    sourceAccountId: '1',
  },
};
