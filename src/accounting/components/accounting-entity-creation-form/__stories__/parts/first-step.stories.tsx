import { AccountingEntityCreationFormStep1 } from '@/accounting/components/accounting-entity-creation-form/parts/first-step';
import type { IAccountingEntityFormValues } from '@/accounting/components/accounting-entity-creation-form/types';
import {
  EAccountingEntityType,
  type IJurisdictionDto,
} from '@/shared/lib/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useFormik } from 'formik';
import { MemoryRouter } from 'react-router-dom';

const jurisdictions: IJurisdictionDto[] = [
  {
    code: 'NG',
    name: 'Nigeria',
    currencyCode: 'NGN',
    maxFiscalMonths: 18,
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
    maxFiscalMonths: 12,
    accountingStandards: {
      [EAccountingEntityType.Individual]: ['GAAP'],
      [EAccountingEntityType.SoleTrader]: ['GAAP'],
      [EAccountingEntityType.PrivateCompany]: ['GAAP'],
    },
  },
];

function FirstStepPreview() {
  const formik = useFormik<IAccountingEntityFormValues>({
    initialValues: {
      name: 'Ada Ventures',
      entityType: EAccountingEntityType.PrivateCompany,
      countryCode: 'NG',
      functionalCurrency: 'NGN',
      reportingCurrency: 'NGN',
      fiscalYearStart: new Date('2026-01-01'),
      fiscalYearEnd: new Date('2026-12-31'),
      appUsageMode: 'non_power_user',
      accountingStandardCode: 'IFRS',
    },
    onSubmit: () => {},
  });

  return (
    <MemoryRouter>
      <form className="w-sm">
        <AccountingEntityCreationFormStep1
          formik={formik}
          getErrorMessage={() => undefined}
          individualName="Ada Lovelace"
          jurisdictions={jurisdictions}
          onNext={() => {}}
        />
      </form>
    </MemoryRouter>
  );
}

const meta = {
  title: 'Accounting/AccountingEntityCreationForm/FirstStep',
  component: FirstStepPreview,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof FirstStepPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
