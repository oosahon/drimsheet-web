import {
  createInflowFormValidation,
  InflowForm,
  type IInflowFormValidationMessages,
  type IInflowFormValues,
} from '@/journal-entries/components/inflow-form';
import type {
  IJournalCounterpartyReq,
  ILedgerAccountDto,
} from '@/shared/lib/api/Api';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';

const destinationAccounts = [
  {
    id: 'ngn-bank',
    code: '1000',
    name: 'NGN bank account',
    type: 'asset',
    balance: { amount: 0, currencyCode: 'NGN', isMinorUnit: false },
  },
  {
    id: 'usd-bank',
    code: '1010',
    name: 'USD bank account',
    type: 'asset',
    balance: { amount: 0, currencyCode: 'USD', isMinorUnit: false },
  },
] as unknown as ILedgerAccountDto[];

const sourceAccounts = [
  {
    id: 'sales',
    code: '4000',
    name: 'Sales revenue',
    type: 'revenue',
    balance: { amount: 0, currencyCode: 'NGN', isMinorUnit: false },
  },
] as unknown as ILedgerAccountDto[];

const payerOptions: IJournalCounterpartyReq[] = [
  { id: 'payer-1', name: 'Acme Consulting', type: 'organization' },
];

const validationMessages: IInflowFormValidationMessages = {
  accountRequired: 'Account is required',
  amountPositive: 'Amount must be greater than zero',
  amountRequired: 'Amount is required',
  categoryRequired: 'Category is required',
  exchangeRateNumber: 'Exchange rate must be a number',
  exchangeRatePositive: 'Exchange rate must be greater than zero',
  exchangeRateRequired: 'Exchange rate is required',
  payerRequired: 'Payer is required',
};

const validFunctionalValues: IInflowFormValues = {
  destinationAccountId: 'ngn-bank',
  categoryAccountId: 'sales',
  amount: { amount: 250, currencyCode: 'NGN', isMinorUnit: false },
  exchangeRate: '',
  payer: { name: 'Payer' },
  description: '',
};

describe('InflowForm validation', () => {
  const schema = createInflowFormValidation(
    destinationAccounts,
    'NGN',
    validationMessages
  );

  it('rejects all mandatory empty values while allowing an empty description', async () => {
    await expect(
      schema.validate(
        {
          destinationAccountId: '',
          categoryAccountId: '',
          amount: {
            amount: Number.NaN,
            currencyCode: 'NGN',
            isMinorUnit: false,
          },
          exchangeRate: '',
          payer: { name: '   ' },
          description: '',
        },
        { abortEarly: false }
      )
    ).rejects.toMatchObject({
      errors: expect.arrayContaining([
        'Account is required',
        'Amount is required',
        'Category is required',
        'Payer is required',
      ]),
    });
  });

  it.each([0, -1])('rejects a non-positive amount: %s', async (amount) => {
    await expect(
      schema.validate({
        ...validFunctionalValues,
        amount: { ...validFunctionalValues.amount, amount },
      })
    ).rejects.toThrow('Amount must be greater than zero');
  });

  it.each([
    ['', 'Exchange rate is required'],
    ['invalid', 'Exchange rate must be a number'],
    ['0', 'Exchange rate must be greater than zero'],
    ['-2', 'Exchange rate must be greater than zero'],
  ])(
    'rejects invalid foreign exchange rate %s',
    async (exchangeRate, error) => {
      await expect(
        schema.validate({
          ...validFunctionalValues,
          destinationAccountId: 'usd-bank',
          amount: { ...validFunctionalValues.amount, currencyCode: 'USD' },
          exchangeRate,
        })
      ).rejects.toThrow(error);
    }
  );

  it('accepts valid foreign- and functional-currency values', async () => {
    await expect(schema.validate(validFunctionalValues)).resolves.toBeTruthy();
    await expect(
      schema.validate({
        ...validFunctionalValues,
        destinationAccountId: 'usd-bank',
        amount: { ...validFunctionalValues.amount, currencyCode: 'USD' },
        exchangeRate: '1500',
      })
    ).resolves.toBeTruthy();
  });
});

describe('InflowForm', () => {
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

  it('renders fields in screenshot order without create-another', () => {
    render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        onSubmit={() => undefined}
        sourceAccounts={sourceAccounts}
      />
    );

    const controls = [
      screen.getByLabelText('Account'),
      screen.getByLabelText('Amount'),
      screen.getByLabelText('Exchange rate'),
      screen.getByLabelText('Category'),
      screen.getByLabelText('Payer'),
      screen.getByLabelText('Description'),
    ];

    for (let index = 1; index < controls.length; index += 1) {
      expect(
        controls[index - 1].compareDocumentPosition(controls[index]) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    }
    expect(
      screen.queryByRole('checkbox', { name: 'Create another transaction' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Split this transaction' })
    ).toHaveAttribute('type', 'button');
    expect(screen.getByRole('button', { name: 'Create' })).toHaveAttribute(
      'type',
      'submit'
    );
  });

  it('keeps destination and source account options in their permitted fields', async () => {
    const user = userEvent.setup();
    render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        onSubmit={() => undefined}
        sourceAccounts={sourceAccounts}
      />
    );

    await user.click(screen.getByRole('combobox', { name: 'Account' }));

    expect(
      await screen.findByRole('option', { name: 'NGN bank account' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'Sales revenue' })
    ).not.toBeInTheDocument();

    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('combobox', { name: 'Category' }));

    expect(
      await screen.findByRole('option', { name: 'Sales revenue' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'NGN bank account' })
    ).not.toBeInTheDocument();
  });

  it('keeps exchange rate visible and disables it until it is needed', () => {
    const { rerender } = render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="EUR"
        initialValues={{ destinationAccountId: 'ngn-bank' }}
        onSubmit={() => undefined}
        sourceAccounts={sourceAccounts}
      />
    );

    expect(screen.getByLabelText('Exchange rate')).not.toBeDisabled();
    expect(screen.getByText('EUR')).toBeInTheDocument();

    rerender(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        initialValues={{ destinationAccountId: 'ngn-bank' }}
        onSubmit={() => undefined}
        sourceAccounts={sourceAccounts}
      />
    );

    expect(screen.getByLabelText('Exchange rate')).toBeDisabled();
  });

  it('synchronizes the amount currency when Account changes', async () => {
    const user = userEvent.setup();
    render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        onSubmit={() => undefined}
        sourceAccounts={sourceAccounts}
      />
    );

    await user.click(screen.getByRole('combobox', { name: 'Account' }));
    await user.click(
      await screen.findByRole('option', { name: 'USD bank account' })
    );

    expect(
      screen.getByRole('combobox', { name: 'Currency: USD' })
    ).toBeDisabled();
    expect(screen.getByLabelText('Exchange rate')).not.toBeDisabled();
  });

  it('submits a selected payer with its generated request identity', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        initialValues={validFunctionalValues}
        onSubmit={onSubmit}
        payerOptions={payerOptions}
        sourceAccounts={sourceAccounts}
      />
    );

    const payer = screen.getByRole('combobox', { name: 'Payer' });
    await user.clear(payer);
    await user.click(payer);
    await user.click(
      await screen.findByRole('option', { name: 'Acme Consulting' })
    );
    await user.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        ...validFunctionalValues,
        payer: {
          id: 'payer-1',
          name: 'Acme Consulting',
          type: 'organization',
        },
      })
    );
  });

  it('submits trimmed free text as a name-only payer payload', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        initialValues={{ ...validFunctionalValues, payer: { name: '' } }}
        onSubmit={onSubmit}
        payerOptions={payerOptions}
        sourceAccounts={sourceAccounts}
      />
    );

    await user.type(
      screen.getByRole('combobox', { name: 'Payer' }),
      '  New payer  '
    );
    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        ...validFunctionalValues,
        payer: { name: 'New payer' },
      })
    );
  });

  it('emits split intent without submitting', async () => {
    const user = userEvent.setup();
    const onSplit = vi.fn();
    const onSubmit = vi.fn();
    render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        initialValues={validFunctionalValues}
        onSplit={onSplit}
        onSubmit={onSubmit}
        sourceAccounts={sourceAccounts}
      />
    );

    await user.click(
      screen.getByRole('button', { name: 'Split this transaction' })
    );

    expect(onSplit).toHaveBeenCalledWith(validFunctionalValues);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows translated validation errors and prevents invalid submission', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        onSubmit={onSubmit}
        sourceAccounts={sourceAccounts}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('Account is required')).toBeInTheDocument();
    expect(screen.getByText('Amount is required')).toBeInTheDocument();
    expect(screen.getByText('Category is required')).toBeInTheDocument();
    expect(screen.getByText('Payer is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('clears a functional-currency exchange rate from the submit payload', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <InflowForm
        destinationAccounts={destinationAccounts}
        functionalCurrencyCode="NGN"
        initialValues={{ ...validFunctionalValues, exchangeRate: '99' }}
        onSubmit={onSubmit}
        sourceAccounts={sourceAccounts}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(validFunctionalValues)
    );
  });
});
