import { AccountCreationForm } from '@/account/components/account-creation-form';
import {
  ELedgerAccountBehavior,
  type ICurrencyDto,
} from '@/shared/lib/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';

const currencies: ICurrencyDto[] = [
  {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    minorUnit: 2,
  },
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    minorUnit: 2,
  },
];

const accountTypes = [
  {
    value: ELedgerAccountBehavior.Bank,
    label: 'Bank account',
  },
  {
    value: ELedgerAccountBehavior.PettyCash,
    label: 'Petty cash',
  },
  {
    value: ELedgerAccountBehavior.TradeReceivable,
    label: 'Trade receivable',
  },
];

const meta = {
  title: 'Ledger Accounts/AccountCreationForm',
  component: AccountCreationForm,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-[min(42rem,calc(100vw-2rem))]">
        <Story />
      </div>
    ),
  ],
  args: {
    accountingCurrencyCode: 'NGN',
    accountTypes,
    currencies,
    onSubmit: () => {},
  },
  argTypes: {
    onSubmit: { action: 'submitted' },
  },
} satisfies Meta<typeof AccountCreationForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialValues: {
      accountType: ELedgerAccountBehavior.Bank,
      currencyCode: 'NGN',
    },
  },
};

export const ForeignCurrency: Story = {
  args: {
    initialValues: {
      name: 'US dollar bank account',
      accountType: ELedgerAccountBehavior.Bank,
      currencyCode: 'USD',
      openingBalance: 1,
      openingDate: '2026-07-01',
      exchangeRate: 1500,
    },
  },
};

export const WithoutOpeningBalance: Story = {
  args: {
    initialValues: {
      name: 'Future savings',
      accountType: ELedgerAccountBehavior.Bank,
      currencyCode: 'NGN',
      createWithoutOpeningBalance: true,
    },
  },
};

export const SubAccount: Story = {
  args: {
    initialValues: {
      name: 'Regional sales',
      accountType: ELedgerAccountBehavior.TradeReceivable,
      currencyCode: 'NGN',
      isSubAccount: true,
    },
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    initialValues: {
      name: 'Operating account',
      accountType: ELedgerAccountBehavior.Bank,
      currencyCode: 'NGN',
    },
  },
};

export const NarrowViewport: Story = {
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};
