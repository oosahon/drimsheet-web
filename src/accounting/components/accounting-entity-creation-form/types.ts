import type {
  ICurrencyDto,
  IJurisdictionDto,
  UAccountingEntityType,
} from '@/shared/lib/api/Api';
import type { FormikProps } from 'formik';

export interface IAccountingEntityFormValues {
  name: string;
  entityType: UAccountingEntityType | '';
  countryCode: string;
  functionalCurrency: string;
  reportingCurrency: string;
  fiscalYearStart: Date | null;
  fiscalYearEnd: Date | null;
  appUsageMode: 'power_user' | 'non_power_user';
  accountingStandardCode: string;
}

export interface AccountingEntityCreationFormProps {
  onSubmit: (values: IAccountingEntityFormValues) => Promise<void> | void;
  individualName?: string;
  loading?: boolean;
  currencies?: ICurrencyDto[];
  jurisdictions?: IJurisdictionDto[];
}

interface StepProps {
  formik: FormikProps<IAccountingEntityFormValues>;
  getErrorMessage: (
    name: keyof IAccountingEntityFormValues
  ) => Array<{ message?: string } | undefined> | undefined;
}

export interface AccountingEntityCreationFormStep1Props extends StepProps {
  individualName: string;
  jurisdictions: IJurisdictionDto[];
  onNext: () => void;
}

export interface AccountingEntityCreationFormStep2Props extends StepProps {
  getFiscalYearStartErrorStr: () => string | undefined;
  getFiscalYearEndErrorStr: () => string | undefined;
  currencies: ICurrencyDto[];
  onNext: () => void;
  onBack: () => void;
}

export interface AccountingEntityCreationFormStep3Props extends StepProps {
  onBack: () => void;
  isSubmitting?: boolean;
}
