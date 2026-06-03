import {
  TransactionLinesForm,
  TransactionLinesFormDialog,
  type ITransactionLineForm,
  type TransactionLinesFormProps,
} from '@/bookkeeping/ui/components/transaction-lines-form';
import {
  ELedgerAccountStatus,
  ELedgerType,
  type ILedgerAccountDto,
  type TEntityId,
  type UAdjunctAccountRule,
  type UContraAccountRule,
  type UNormalBalance,
} from '@/shared/utils/api/Api';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/hooks/use-currencies', () => ({
  default: () => ({
    data: [
      { code: 'NGN', symbol: 'N', name: 'Nigerian Naira', minorUnit: 2 },
      { code: 'USD', symbol: '$', name: 'United States Dollar', minorUnit: 2 },
    ],
  }),
}));

const createAccount = (
  overrides: Pick<ILedgerAccountDto, 'id' | 'code' | 'name'> &
    Partial<ILedgerAccountDto>
): ILedgerAccountDto => {
  const baseAccount: ILedgerAccountDto = {
    id: 'account-id' as TEntityId,
    code: '1000',
    name: 'Account',
    type: ELedgerType.Asset,
    normalBalance: 'debit' as UNormalBalance,
    subType: 'cash_and_cash_equivalent',
    behavior: 'bank',
    isControlAccount: false,
    status: ELedgerAccountStatus.Active,
    contraAccountRule: 'contra_not_applicable' as UContraAccountRule,
    adjunctAccountRule: 'adjunct_not_applicable' as UAdjunctAccountRule,
    balance: { amount: 150000, currencyCode: 'NGN', isMinorUnit: false },
    functionalBalance: {
      amount: 150000,
      currencyCode: 'NGN',
      isMinorUnit: false,
    },
    createdAt: '2026-05-01T08:00:00Z',
    updatedAt: '2026-05-01T08:00:00Z',
    createdBy: 'user-1' as TEntityId,
    materializedPath: '',
    accountingEntityId: 'entity-1' as TEntityId,
  };

  return { ...baseAccount, ...overrides };
};

const mockAccounts: ILedgerAccountDto[] = [
  createAccount({
    id: 'main-account' as TEntityId,
    code: '1000',
    name: 'Main Bank Account',
  }),
  createAccount({
    id: 'petty-cash' as TEntityId,
    code: '1010',
    name: 'Petty Cash Vault',
    behavior: 'petty_cash',
  }),
  createAccount({
    id: 'usd-account' as TEntityId,
    code: '1100',
    name: 'USD Operating Account',
    balance: { amount: 12000, currencyCode: 'USD', isMinorUnit: false },
  }),
];

const defaultLine: ITransactionLineForm = {
  accountId: 'main-account',
  amount: 100,
  currency: 'NGN',
};

const usdLine: ITransactionLineForm = {
  accountId: 'usd-account',
  amount: 50,
  currency: 'USD',
};

const renderForm = (props?: Partial<TransactionLinesFormProps>) => {
  const onSubmit = vi.fn<TransactionLinesFormProps['onSubmit']>();
  const onCancel = vi.fn();

  render(
    <TransactionLinesForm
      accounts={mockAccounts}
      defaultValue={[]}
      onSubmit={onSubmit}
      onCancel={onCancel}
      {...props}
    />
  );

  return { onSubmit, onCancel };
};

const selectAccount = async (accountName: string) => {
  const user = userEvent.setup();
  const input = screen.getByRole('combobox', { name: 'Account' });

  await user.click(input);
  await user.click(await screen.findByRole('option', { name: accountName }));
};

describe('TransactionLinesForm', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.hasPointerCapture = vi.fn(
      () => false
    ) as unknown as typeof window.HTMLElement.prototype.hasPointerCapture;
    window.HTMLElement.prototype.releasePointerCapture =
      vi.fn() as unknown as typeof window.HTMLElement.prototype.releasePointerCapture;
    window.HTMLElement.prototype.setPointerCapture =
      vi.fn() as unknown as typeof window.HTMLElement.prototype.setPointerCapture;
    window.HTMLElement.prototype.scrollIntoView =
      vi.fn() as unknown as typeof window.HTMLElement.prototype.scrollIntoView;
  });

  it('renders an entry editor by default when there are no lines', () => {
    renderForm();

    expect(
      screen.getByRole('combobox', { name: 'Account' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Currency' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Add' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Delete line 1' })
    ).not.toBeInTheDocument();
  });

  it('renders saved lines as cards with edit and delete actions', () => {
    renderForm({
      defaultValue: [defaultLine],
    });

    expect(screen.getByText('Main Bank Account')).toBeInTheDocument();
    expect(screen.getByText(/100\.00/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Edit line 1' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Delete line 1' })
    ).toBeInTheDocument();
    expect(screen.queryByLabelText('Amount')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('adds and deletes transaction lines locally', async () => {
    const user = userEvent.setup();
    renderForm({
      defaultValue: [defaultLine],
    });

    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByRole('combobox', { name: 'Account' })).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Add' })
    ).not.toBeInTheDocument();

    await selectAccount('Petty Cash Vault');
    await user.clear(screen.getByLabelText('Amount'));
    await user.type(screen.getByLabelText('Amount'), '25');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('Petty Cash Vault')).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /Delete line/i })
    ).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'Delete line 2' }));

    expect(screen.queryByText('Petty Cash Vault')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete line 1' })).toBeVisible();
  });

  it('keeps edits internal until save is clicked', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();

    await selectAccount('Main Bank Account');
    await user.clear(screen.getByLabelText('Amount'));
    await user.type(screen.getByLabelText('Amount'), '250');

    expect(onSubmit).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Main Bank Account')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith([
      {
        accountId: 'main-account',
        amount: 250,
        currency: 'NGN',
      },
    ]);
  });

  it('resets to the default value when cancel is clicked', async () => {
    const user = userEvent.setup();
    const { onSubmit, onCancel } = renderForm({
      defaultValue: [defaultLine],
    });

    await user.click(screen.getByRole('button', { name: 'Edit line 1' }));
    await user.clear(screen.getByLabelText('Amount'));
    await user.type(screen.getByLabelText('Amount'), '999');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByLabelText('Amount')).not.toBeInTheDocument();
    expect(onCancel).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onCancel).not.toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith([defaultLine]);
  });

  it('shows only one editor and hides global actions while editing', async () => {
    const user = userEvent.setup();
    renderForm({
      defaultValue: [defaultLine, usdLine],
    });

    await user.click(screen.getByRole('button', { name: 'Edit line 1' }));

    expect(screen.getAllByRole('combobox', { name: 'Account' })).toHaveLength(
      1
    );
    expect(
      screen.queryByRole('button', { name: 'Add' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit line 2' })).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Delete line 2' })
    ).toBeDisabled();
  });
});

describe('TransactionLinesFormDialog', () => {
  it('renders the form in a dialog and closes from cancel', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <TransactionLinesFormDialog
        open
        title="Edit lines"
        accounts={mockAccounts}
        defaultValue={[defaultLine]}
        onSubmit={vi.fn()}
        onClose={onClose}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Edit lines' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
