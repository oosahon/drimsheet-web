import type { AccountingEntityCreationFormStep3Props } from '@/accounting/components/accounting-entity-creation-form/types';
import { Button } from '@/shared/components/button';
import { FieldGroup } from '@/shared/components/field';
import { AppUsageModeRadioGroup } from '@/user/components/app-usage-mode-radio-group';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function AccountingEntityCreationFormStep3({
  formik,
  getErrorMessage,
  onBack,
  isSubmitting,
}: Readonly<AccountingEntityCreationFormStep3Props>) {
  const { t } = useTranslation('accounting');
  const isComplete = formik.isValid;

  const back_button_label = t('back_button_label');
  const complete_setup_button_label = t('complete_setup_button_label');

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup>
        <AppUsageModeRadioGroup
          value={formik.values.appUsageMode}
          onChange={(val) => formik.setFieldValue('appUsageMode', val)}
          error={getErrorMessage('appUsageMode')}
        />
      </FieldGroup>
      <div className="flex justify-between mt-4">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={onBack}
        >
          <ArrowLeft />
          {back_button_label}
        </Button>
        <Button
          type="submit"
          disabled={!isComplete || isSubmitting}
          loading={isSubmitting}
        >
          {complete_setup_button_label}
        </Button>
      </div>
    </div>
  );
}

export { AccountingEntityCreationFormStep3 };
