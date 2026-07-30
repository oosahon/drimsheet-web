import { useGetBankByCountry } from '@/account/hooks/use-get-bank-by-country';
import { useState } from 'react';
import { BankAccountForm } from './bank-account-form';
import type { BankAccountFormProps } from './types';

export type BankAccountFormContainerProps = Omit<
  BankAccountFormProps,
  'banks' | 'isBanksLoading' | 'onBankLocationChange'
> & {
  initialBankLocation?: string;
};

export function BankAccountFormContainer({
  initialBankLocation = '',
  initialValues,
  ...props
}: Readonly<BankAccountFormContainerProps>) {
  const [selectedLocation, setSelectedLocation] = useState<string>(
    initialValues?.bankLocation ?? initialBankLocation
  );

  const { data: banks = [], isPending: isBanksLoading } =
    useGetBankByCountry(selectedLocation);

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
  };

  return (
    <BankAccountForm
      {...props}
      banks={banks}
      isBanksLoading={isBanksLoading}
      initialValues={initialValues}
      onBankLocationChange={handleLocationChange}
    />
  );
}
