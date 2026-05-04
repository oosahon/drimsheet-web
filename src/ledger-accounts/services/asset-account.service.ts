import type { IPettyCashAccountFormValues } from '@/ledger-accounts/ui/components/petty-cash-account-form';
import purpleLedgerApi from '@/shared/utils/api';
import type { IPettyCashAccountCreationReq } from '@/shared/utils/api/Api';

const assetAccountService = {
  async createPettyCashAccount(payload: IPettyCashAccountFormValues) {
    const body: IPettyCashAccountCreationReq = {
      name: payload.name,
      currencyCode: payload.currencyCode,
      openingBalance: {
        amount: {
          amount: payload.openingBalance,
          currencyCode: payload.currencyCode,
          isMinorUnit: true,
        },
        exchangeRate: null,
      },
      isControlAccount: false,
    };

    await purpleLedgerApi.ledger.makePettyCashSubAccount(body);
  },
};

export default assetAccountService;
