import { AccountingEntityCreationForm } from '@/accounting/ui/accounting-entity-creation-form';
import {
  EAccountingEntityType,
  type ICurrencyDto,
  type IJurisdictionDto,
} from '@/shared/utils/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

const sampleJurisdictions: IJurisdictionDto[] = [
  {
    code: 'NG',
    name: 'Nigeria',
    currencyCode: 'NGN',
    accountingStandards: {
      [EAccountingEntityType.Individual]: ['IFRS'],
      [EAccountingEntityType.SoleTrader]: ['IFRS'],
      [EAccountingEntityType.PrivateCompany]: ['IFRS'],
    },
  },
  {
    code: 'US',
    name: 'United States',
    currencyCode: 'USD',
    accountingStandards: {
      [EAccountingEntityType.Individual]: ['GAAP'],
      [EAccountingEntityType.SoleTrader]: ['GAAP'],
      [EAccountingEntityType.PrivateCompany]: ['GAAP'],
    },
  },
];

const sampleCurrencies: ICurrencyDto[] = [
  {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    minorUnit: 2,
  },
  {
    code: 'USD',
    name: 'United States Dollar',
    symbol: '$',
    minorUnit: 2,
  },
];

const meta = {
  title: 'Accounting/AccountingEntityCreationForm',
  component: AccountingEntityCreationForm,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="p-4 max-w-sm mx-auto">
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
    onSubmit: () => {},
    jurisdictions: sampleJurisdictions,
    currencies: sampleCurrencies,
  },
} satisfies Meta<typeof AccountingEntityCreationForm>;

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
