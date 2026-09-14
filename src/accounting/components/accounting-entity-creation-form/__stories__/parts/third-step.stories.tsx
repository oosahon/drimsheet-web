import { AccountingEntityCreationFormStep3 } from '@/accounting/components/accounting-entity-creation-form/parts/third-step';
import type { IAccountingEntityFormValues } from '@/accounting/components/accounting-entity-creation-form/types';
import { EAccountingEntityType } from '@/shared/lib/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useFormik } from 'formik';

function ThirdStepPreview() {
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
      <AccountingEntityCreationFormStep3
        formik={formik}
        getErrorMessage={() => undefined}
        onBack={() => {}}
        isSubmitting={false}
      />
    </form>
  );
}

const meta = {
  title: 'Accounting/AccountingEntityCreationForm/ThirdStep',
  component: ThirdStepPreview,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ThirdStepPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
