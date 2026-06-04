import { AccountCombobox } from '@/ledger-accounts/ui/components/account-combobox';
import useCurrencies from '@/shared/hooks/use-currencies';
import { Button } from '@/shared/ui/components/button';
import { CurrencySelect } from '@/shared/ui/components/currency-select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/components/dialog';
import { Field, FieldGroup } from '@/shared/ui/components/field';
import { Label } from '@/shared/ui/components/label';
import Money from '@/shared/ui/components/money';
import { MoneyInput } from '@/shared/ui/components/money-input';
import type { ICurrencyDto, ILedgerAccountDto } from '@/shared/utils/api/Api';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * ===================================
 *          FORM
 * ===================================
 */
export interface ITransactionLineForm {
  accountId: string;
  amount: number;
  currency: string;
}

export interface TransactionLinesFormProps {
  defaultValue: ITransactionLineForm[];
  onSubmit: (values: ITransactionLineForm[]) => void;
  accounts: ILedgerAccountDto[];
  onCancel?: () => void;
}

interface ITransactionLineFormState extends ITransactionLineForm {
  formId: string;
}

interface TransactionLinesFormContentProps extends Omit<
  TransactionLinesFormProps,
  'defaultValue'
> {
  defaultLines: ITransactionLineFormState[];
}

type ActiveEditor = { mode: 'new' } | { mode: 'edit'; index: number } | null;

const emptyLine: ITransactionLineForm = {
  accountId: '',
  amount: 0,
  currency: '',
};

let transactionLineFormId = 0;

function createEmptyLine() {
  return { ...emptyLine };
}

function createFormLine(
  line: ITransactionLineForm = emptyLine
): ITransactionLineFormState {
  transactionLineFormId += 1;

  return {
    ...line,
    formId: `transaction-line-form-${transactionLineFormId}`,
  };
}

function cloneLines(lines: ITransactionLineForm[]) {
  return lines.map(createFormLine);
}

function getLineCurrency(
  line: ITransactionLineForm,
  account?: ILedgerAccountDto
) {
  return line.currency || account?.balance.currencyCode || '';
}

interface TransactionLineCardProps {
  line: ITransactionLineForm;
  account?: ILedgerAccountDto;
  lineNumber: number;
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

function TransactionLineCard({
  line,
  account,
  lineNumber,
  onEdit,
  onDelete,
  disabled,
}: TransactionLineCardProps) {
  const { t } = useTranslation(['bookkeeping']);

  const currencyCode = getLineCurrency(line, account);
  const unknown_account_text = t('bookkeeping:unknown_account_text');
  const edit_line_text = t('bookkeeping:edit_transaction_line_text', {
    lineNumber,
  });
  const delete_line_text = t('bookkeeping:delete_transaction_line_text', {
    lineNumber,
  });

  return (
    <div className="flex items-center gap-2 rounded-md border border-border/80 bg-card px-3 py-2 shadow-xs">
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">
          {account?.name || unknown_account_text}
        </div>
      </div>

      <div className="shrink-0 text-sm font-medium tabular-nums">
        {currencyCode ? (
          <Money
            value={{
              amount: line.amount,
              currencyCode,
              isMinorUnit: false,
            }}
          />
        ) : (
          line.amount
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={edit_line_text}
          onClick={onEdit}
          disabled={disabled}
        >
          <Pencil />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={delete_line_text}
          onClick={onDelete}
          disabled={disabled}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}

interface TransactionLineEditorProps {
  line: ITransactionLineForm;
  accounts: ILedgerAccountDto[];
  currencies: ICurrencyDto[];
  onChange: (line: ITransactionLineForm) => void;
  onSave: () => void;
  onCancel: () => void;
}

function TransactionLineEditor({
  line,
  accounts,
  currencies,
  onChange,
  onSave,
  onCancel,
}: TransactionLineEditorProps) {
  const { t } = useTranslation(['bookkeeping', 'shared']);

  const selectedAccount = accounts.find(
    (account) => account.id === line.accountId
  );
  const currencyCode = getLineCurrency(line, selectedAccount);

  const updateLine = (
    field: keyof ITransactionLineForm,
    value: string | number
  ) => {
    onChange({ ...line, [field]: value });
  };

  const updateAccount = (accountId: string) => {
    const accountCurrency = accounts.find((account) => account.id === accountId)
      ?.balance.currencyCode;

    onChange({
      ...line,
      accountId,
      currency: line.currency || accountCurrency || '',
    });
  };

  const account_text = t('shared:account');
  const currency_text = t('shared:currency');
  const amount_label = t('bookkeeping:amount_label');
  const cancel_text = t('shared:cancel');
  const save_text = t('shared:save');

  return (
    <div className="space-y-3 rounded-md border border-border/80 bg-background p-3">
      <AccountCombobox
        id="transaction-line-account-editor"
        label={account_text}
        value={line.accountId}
        accounts={accounts}
        onChange={updateAccount}
      />

      <div className="grid grid-cols-[2fr_3fr] gap-x-3">
        <CurrencySelect
          label={currency_text}
          value={line.currency}
          currencies={currencies}
          onChange={(value) => updateLine('currency', value)}
          displayCode
        />

        <Field>
          <Label htmlFor="transaction-line-amount-editor">{amount_label}</Label>
          <MoneyInput
            id="transaction-line-amount-editor"
            name="transaction-line-amount-editor"
            currencyCode={currencyCode}
            value={line.amount}
            onChange={(event) => {
              const amount = Number(event.target.value || 0);
              updateLine('amount', amount);
            }}
          />
        </Field>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {cancel_text}
        </Button>
        <Button type="button" onClick={onSave}>
          {save_text}
        </Button>
      </div>
    </div>
  );
}

function TransactionLinesFormContent({
  defaultLines,
  onSubmit,
  accounts,
  onCancel,
}: TransactionLinesFormContentProps) {
  const { t } = useTranslation(['shared']);

  const [lines, setLines] = useState<ITransactionLineFormState[]>(defaultLines);
  const [activeEditor, setActiveEditor] = useState<ActiveEditor>(
    defaultLines.length ? null : { mode: 'new' }
  );
  const [draftLine, setDraftLine] =
    useState<ITransactionLineForm>(createEmptyLine);

  const { data: currencies = [] } = useCurrencies();

  const hasOpenEditor = activeEditor !== null;

  const showNewLineEditor = () => {
    setDraftLine(createEmptyLine());
    setActiveEditor({ mode: 'new' });
  };

  const showExistingLineEditor = (index: number) => {
    const line = lines[index];
    if (!line) return;

    setDraftLine({
      accountId: line.accountId,
      amount: line.amount,
      currency: line.currency,
    });
    setActiveEditor({ mode: 'edit', index });
  };

  const deleteLine = (index: number) => {
    setLines((currentLines) =>
      currentLines.filter((_, lineIndex) => lineIndex !== index)
    );
  };

  const cancelLineEditor = () => {
    setActiveEditor(null);
    setDraftLine(createEmptyLine());
  };

  const saveLineEditor = () => {
    const selectedAccount = accounts.find(
      (account) => account.id === draftLine.accountId
    );
    const lineToSave = {
      ...draftLine,
      currency: getLineCurrency(draftLine, selectedAccount),
    };

    if (activeEditor?.mode === 'edit') {
      setLines((currentLines) =>
        currentLines.map((line, lineIndex) =>
          lineIndex === activeEditor.index ? { ...line, ...lineToSave } : line
        )
      );
    } else {
      setLines((currentLines) => [...currentLines, createFormLine(lineToSave)]);
    }

    cancelLineEditor();
  };

  const handleCancel = () => {
    setLines(defaultLines);
    setActiveEditor(defaultLines.length ? null : { mode: 'new' });
    setDraftLine(createEmptyLine());
    onCancel?.();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(
      lines.map(({ accountId, amount, currency }) => ({
        accountId,
        amount,
        currency,
      }))
    );
  };

  const add_text = t('shared:add');
  const cancel_text = t('shared:cancel');
  const save_text = t('shared:save');

  return (
    <div className="w-sm max-w-full">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="max-h-[500px] space-y-3 overflow-y-auto pr-1">
            {lines.map((line, index) => {
              const account = accounts.find(
                (account) => account.id === line.accountId
              );
              const lineNumber = index + 1;
              const isEditingLine =
                activeEditor?.mode === 'edit' && activeEditor.index === index;

              return (
                <div key={line.formId} className="space-y-3">
                  <TransactionLineCard
                    line={line}
                    account={account}
                    lineNumber={lineNumber}
                    onEdit={() => showExistingLineEditor(index)}
                    onDelete={() => deleteLine(index)}
                    disabled={hasOpenEditor}
                  />

                  {isEditingLine && (
                    <TransactionLineEditor
                      line={draftLine}
                      accounts={accounts}
                      currencies={currencies}
                      onChange={setDraftLine}
                      onSave={saveLineEditor}
                      onCancel={cancelLineEditor}
                    />
                  )}
                </div>
              );
            })}

            {activeEditor?.mode === 'new' && (
              <TransactionLineEditor
                line={draftLine}
                accounts={accounts}
                currencies={currencies}
                onChange={setDraftLine}
                onSave={saveLineEditor}
                onCancel={cancelLineEditor}
              />
            )}
          </div>

          {!hasOpenEditor && (
            <>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={showNewLineEditor}
                >
                  <Plus />
                  {add_text}
                </Button>
              </div>

              <div className="mt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  {cancel_text}
                </Button>
                <Button type="submit">{save_text}</Button>
              </div>
            </>
          )}
        </FieldGroup>
      </form>
    </div>
  );
}

function TransactionLinesForm({
  defaultValue,
  onSubmit,
  accounts,
  onCancel,
}: TransactionLinesFormProps) {
  const defaultValueKey = JSON.stringify(defaultValue);

  return (
    <TransactionLinesFormContent
      key={defaultValueKey}
      defaultLines={cloneLines(defaultValue)}
      onSubmit={onSubmit}
      accounts={accounts}
      onCancel={onCancel}
    />
  );
}

/**
 * ===================================
 *          DIALOG
 * ===================================
 */
export interface TransactionLinesFormDialogProps extends TransactionLinesFormProps {
  open: boolean;
  onClose: () => void;
  title?: string;
}

function TransactionLinesFormDialog({
  open,
  onClose,
  title,
  ...formProps
}: TransactionLinesFormDialogProps) {
  const { t } = useTranslation(['bookkeeping']);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) onClose();
  };

  const transaction_lines_title_text = t('bookkeeping:transaction_lines_title');
  const transaction_lines_dialog_description_text = t(
    'bookkeeping:transaction_lines_dialog_description'
  );
  const title_text = title ?? transaction_lines_title_text;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-sm bg-card border-border/80 shadow-2xl backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight text-foreground font-heading">
            {title_text}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {transaction_lines_dialog_description_text}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex justify-center">
          <TransactionLinesForm {...formProps} onCancel={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * ===================================
 *          EXPORTS
 * ===================================
 */
export {
  TransactionLineCard,
  TransactionLinesForm,
  TransactionLinesFormDialog,
};
