import PettyCashAccountFormContainer from '@/ledger-accounts/ui/containers/petty-cash-account-form-container';
import { GradientBox } from '@/shared/ui/gradient-box';

export default function PettyCashAccountRoute() {
  return (
    <div>
      <GradientBox variant="warning" className="max-w-xs min-h-[100px]">
        Foo
      </GradientBox>
      <PettyCashAccountFormContainer />
    </div>
  );
}
