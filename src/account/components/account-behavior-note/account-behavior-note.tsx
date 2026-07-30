import { Alert, AlertDescription, AlertTitle } from '@/shared/components/alert';
import {
  ELedgerAccountBehavior,
  type ULedgerAccountBehavior,
} from '@/shared/lib/api/Api';
import { InfoIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { AccountBehaviorNoteProps } from './types';

export function AccountBehaviorNote({
  behavior,
}: Readonly<AccountBehaviorNoteProps>) {
  const { t } = useTranslation<'ledger-accounts'>('ledger-accounts');

  const descriptions = {
    [ELedgerAccountBehavior.Bank]: t('account_behavior_bank_description'),
    [ELedgerAccountBehavior.PettyCash]: t(
      'account_behavior_petty_cash_description'
    ),
    [ELedgerAccountBehavior.DefaultCash]: t(
      'account_behavior_default_cash_description'
    ),
    [ELedgerAccountBehavior.StockAndEtfs]: t(
      'account_behavior_stock_and_etfs_description'
    ),
    [ELedgerAccountBehavior.Bonds]: t('account_behavior_bonds_description'),
    [ELedgerAccountBehavior.StatutoryReceivable]: t(
      'account_behavior_statutory_receivable_description'
    ),
    [ELedgerAccountBehavior.TradeReceivable]: t(
      'account_behavior_trade_receivable_description'
    ),
    [ELedgerAccountBehavior.DefaultReceivables]: t(
      'account_behavior_default_receivables_description'
    ),
    [ELedgerAccountBehavior.Default]: t('account_behavior_default_description'),
    [ELedgerAccountBehavior.CreditCard]: t(
      'account_behavior_credit_card_description'
    ),
    [ELedgerAccountBehavior.Overdraft]: t(
      'account_behavior_overdraft_description'
    ),
    [ELedgerAccountBehavior.ShortTermLoan]: t(
      'account_behavior_short_term_loan_description'
    ),
    [ELedgerAccountBehavior.DefaultShortTermDebt]: t(
      'account_behavior_default_short_term_debt_description'
    ),
    [ELedgerAccountBehavior.TaxPayable]: t(
      'account_behavior_tax_payable_description'
    ),
    [ELedgerAccountBehavior.TradePayable]: t(
      'account_behavior_trade_payable_description'
    ),
    [ELedgerAccountBehavior.DefaultPayable]: t(
      'account_behavior_default_payable_description'
    ),
    [ELedgerAccountBehavior.Mortgage]: t(
      'account_behavior_mortgage_description'
    ),
    [ELedgerAccountBehavior.OtherLongTermLoan]: t(
      'account_behavior_other_long_term_loan_description'
    ),
    [ELedgerAccountBehavior.OwnerCapital]: t(
      'account_behavior_owner_capital_description'
    ),
    [ELedgerAccountBehavior.RetainedEarnings]: t(
      'account_behavior_retained_earnings_description'
    ),
    [ELedgerAccountBehavior.RevaluationReserve]: t(
      'account_behavior_revaluation_reserve_description'
    ),
    [ELedgerAccountBehavior.OpeningBalanceEquity]: t(
      'account_behavior_opening_balance_equity_description'
    ),
    [ELedgerAccountBehavior.Sales]: t('account_behavior_sales_description'),
    [ELedgerAccountBehavior.Services]: t(
      'account_behavior_services_description'
    ),
    [ELedgerAccountBehavior.Subscriptions]: t(
      'account_behavior_subscriptions_description'
    ),
    [ELedgerAccountBehavior.EmploymentIncome]: t(
      'account_behavior_employment_income_description'
    ),
    [ELedgerAccountBehavior.InterestIncome]: t(
      'account_behavior_interest_income_description'
    ),
    [ELedgerAccountBehavior.GainOnAssetSale]: t(
      'account_behavior_gain_on_asset_sale_description'
    ),
    [ELedgerAccountBehavior.UnrealizedGains]: t(
      'account_behavior_unrealized_gains_description'
    ),
    [ELedgerAccountBehavior.Cogs]: t('account_behavior_cogs_description'),
    [ELedgerAccountBehavior.CostOfServices]: t(
      'account_behavior_cost_of_services_description'
    ),
    [ELedgerAccountBehavior.CostOfRevenue]: t(
      'account_behavior_cost_of_revenue_description'
    ),
    [ELedgerAccountBehavior.DefaultDirectCost]: t(
      'account_behavior_default_direct_cost_description'
    ),
    [ELedgerAccountBehavior.PayrollAndPersonnel]: t(
      'account_behavior_payroll_and_personnel_description'
    ),
    [ELedgerAccountBehavior.RentAndUtilities]: t(
      'account_behavior_rent_and_utilities_description'
    ),
    [ELedgerAccountBehavior.AdminAndGeneral]: t(
      'account_behavior_admin_and_general_description'
    ),
    [ELedgerAccountBehavior.MarketingAndSelling]: t(
      'account_behavior_marketing_and_selling_description'
    ),
    [ELedgerAccountBehavior.ResearchAndDevelopment]: t(
      'account_behavior_research_and_development_description'
    ),
    [ELedgerAccountBehavior.DepreciationAndAmortization]: t(
      'account_behavior_depreciation_and_amortization_description'
    ),
    [ELedgerAccountBehavior.BankCharge]: t(
      'account_behavior_bank_charge_description'
    ),
    [ELedgerAccountBehavior.FinanceCost]: t(
      'account_behavior_finance_cost_description'
    ),
    [ELedgerAccountBehavior.Interest]: t(
      'account_behavior_interest_description'
    ),
    [ELedgerAccountBehavior.TaxExpense]: t(
      'account_behavior_tax_expense_description'
    ),
    [ELedgerAccountBehavior.UnrealizedLoss]: t(
      'account_behavior_unrealized_loss_description'
    ),
    [ELedgerAccountBehavior.AssetDisposalLoss]: t(
      'account_behavior_asset_disposal_loss_description'
    ),
    [ELedgerAccountBehavior.ImpairmentLoss]: t(
      'account_behavior_impairment_loss_description'
    ),
    [ELedgerAccountBehavior.OtherLoss]: t(
      'account_behavior_other_loss_description'
    ),
  } satisfies Record<ULedgerAccountBehavior, string>;

  const account_behavior_note_title = t('account_behavior_note_title');

  return (
    <Alert className="bg-muted/60">
      <InfoIcon aria-hidden="true" />
      <AlertTitle>{account_behavior_note_title}</AlertTitle>
      <AlertDescription>{descriptions[behavior]}</AlertDescription>
    </Alert>
  );
}
