import { AccountingEntityCreationFormStep2 } from '@/accounting/components/accounting-entity-creation-form/parts/second-step';
import type { IAccountingEntityFormValues } from '@/accounting/components/accounting-entity-creation-form/types';
import { EAccountingEntityType, type ICurrencyDto } from '@/shared/lib/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useFormik } from 'formik';

const currencies: ICurrencyDto[] = [
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

function SecondStepPreview() {
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
    <form className="w-sm">
      <AccountingEntityCreationFormStep2
        formik={formik}
        getErrorMessage={() => undefined}
        getFiscalYearStartErrorStr={() => undefined}
        getFiscalYearEndErrorStr={() => undefined}
        currencies={currencies}
        onNext={() => {}}
        onBack={() => {}}
      />
    </form>
  );
}

const meta = {
  title: 'Accounting/AccountingEntityCreationForm/SecondStep',
  component: SecondStepPreview,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof SecondStepPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
