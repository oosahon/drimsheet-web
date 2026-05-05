import type {
  ILedgerAccountDto,
  TEntityId,
  UAdjunctAccountRule,
  UContraAccountRule,
  ULedgerAccountStatus,
  ULedgerType,
  UNormalBalance,
} from '@/shared/utils/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import {
  AccountCarouselItem,
  AccountOverviewCarousel,
} from './account-overview-carousel';

const createMockAccount = (
  id: string,
  name: string,
  amount: number,
  currencyCode: string
): ILedgerAccountDto => ({
  id: id as TEntityId,
  code: '1000',
  materializedPath: '1000',
  accountingEntityId: 'entity-1' as TEntityId,
  type: 'asset' as ULedgerType,
  normalBalance: 'debit' as UNormalBalance,
  subType: 'cash_and_cash_equivalent',
  behavior: 'cash',
  isControlAccount: false,
  name,
  status: 'active' as ULedgerAccountStatus,
  contraAccountRule: 'contra_not_applicable' as UContraAccountRule,
  adjunctAccountRule: 'adjunct_not_applicable' as UAdjunctAccountRule,
  createdBy: 'user-1' as TEntityId,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  balance: {
    amount,
    currencyCode,
    isMinorUnit: true,
  },
  functionalBalance: {
    amount,
    currencyCode,
    isMinorUnit: true,
  },
});

const mockAccounts: ILedgerAccountDto[] = [
  createMockAccount('uuid-1', 'Petty Cash', 150000, 'USD'),
  createMockAccount('uuid-2', 'Main Bank Account', 4500000, 'EUR'),
  createMockAccount('uuid-3', 'Savings Account', 1000000, 'GBP'),
  createMockAccount('uuid-4', 'Operating Cash', 50000, 'USD'),
  createMockAccount('uuid-5', 'Reserve Account', 2500000, 'USD'),
];

const meta = {
  title: 'Ledger Accounts/AccountOverviewCarousel',
  component: AccountOverviewCarousel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="w-full min-w-[600px] max-w-4xl p-8 bg-background">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof AccountOverviewCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    accounts: mockAccounts,
  },
};

export const Empty: Story = {
  args: {
    accounts: [],
  },
};

export const FewItems: Story = {
  args: {
    accounts: mockAccounts.slice(0, 2),
  },
};

export const SingleItem: StoryObj<typeof AccountCarouselItem> = {
  render: (args) => <AccountCarouselItem {...args} />,
  args: {
    account: mockAccounts[0],
  },
};
