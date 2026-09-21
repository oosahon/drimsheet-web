import { expect, test } from '@integration/fixtures/test';
import {
  authenticatedUser,
  registerAuthenticatedAppRoutes,
} from '@integration/mocks/authenticated-app';
import type { Page } from '@playwright/test';

const timestamp = '2026-09-16T10:00:00.000Z';
const money = (amount: number, currencyCode = 'NGN') => ({
  amount,
  currencyCode,
  isMinorUnit: false,
});
const accountNamesById: Record<string, string> = {
  'cash-main': 'Main checking',
  'cash-usd': 'USD account',
  gift: 'Gift',
  services: 'Professional services',
};
const counterpartyNamesById: Record<string, string> = {
  osahon: 'Osahon Oboite',
  acme: 'Acme Consulting',
};
const line = (
  id: string,
  entryId: string,
  accountId: string,
  counterpartyId: string,
  sequenceOrder: number,
  amount: ReturnType<typeof money>
) => ({
  id,
  entryId,
  account: { id: accountId, name: accountNamesById[accountId] },
  counterparty: {
    id: counterpartyId,
    name: counterpartyNamesById[counterpartyId],
  },
  sequenceOrder,
  amount,
  exchangeRate: null,
  functionalAmount: amount,
  side: 'debit',
  description: null,
  version: 1,
  createdAt: timestamp,
  updatedAt: timestamp,
});
const entry = (
  id: string,
  sourceType: string,
  lines: ReturnType<typeof line>[]
) => ({
  id,
  accountingEntityId: 'entity-1',
  sourceType,
  memo: null,
  status: 'posted',
  effectiveDate: timestamp,
  postedAt: timestamp,
  voidedAt: null,
  voidingEntryId: null,
  version: 1,
  createdBy: authenticatedUser.id,
  createdAt: timestamp,
  updatedAt: timestamp,
  attachments: [],
  lines,
});

const journalEntries = [
  entry('payment-1', 'payment', [
    line('p-1', 'payment-1', 'cash-main', 'osahon', 1, money(125_000)),
    line('p-2', 'payment-1', 'gift', 'osahon', 2, money(125_000)),
  ]),
  entry('receipt-1', 'receipt', [
    line('r-1', 'receipt-1', 'services', 'acme', 1, money(85_000)),
    line('r-2', 'receipt-1', 'cash-main', 'acme', 2, money(85_000)),
  ]),
  entry('transfer-1', 'transfer', [
    line('t-1', 'transfer-1', 'cash-usd', 'osahon', 1, money(1_000, 'USD')),
    line('t-2', 'transfer-1', 'cash-main', 'osahon', 2, money(1_590_000)),
  ]),
];

const accounts = [
  { id: 'cash-main', name: 'Main checking' },
  { id: 'cash-usd', name: 'USD account' },
  { id: 'gift', name: 'Gift' },
  { id: 'services', name: 'Professional services' },
];
const counterparties = [
  { id: 'osahon', name: 'Osahon Oboite' },
  { id: 'acme', name: 'Acme Consulting' },
];

async function registerRoutes(page: Page, journalQueries: URLSearchParams[]) {
  await registerAuthenticatedAppRoutes(page);
  await page.route('**/api/v1/auth/login-with-email', async (route) => {
    await route.fulfill({ json: { accessToken: 'integration-test-token' } });
  });
  await page.route('**/api/v1/auth/refresh-access-token', async (route) => {
    await route.fulfill({ json: { accessToken: 'integration-test-token' } });
  });
  await page.route('**/api/v1/journal-entries?*', async (route) => {
    journalQueries.push(new URL(route.request().url()).searchParams);
    await route.fulfill({
      json: {
        data: journalEntries,
        meta: { page: 1, limit: 10, total: 3, totalPages: 1 },
      },
    });
  });
  await page.route('**/api/v1/ledger/posting-accounts*', async (route) => {
    await route.fulfill({
      json: {
        data: accounts,
        meta: { page: 1, limit: 100, total: 4, totalPages: 1 },
      },
    });
  });
  await page.route('**/api/v1/counterparties*', async (route) => {
    await route.fulfill({
      json: {
        data: counterparties,
        meta: {
          page: 1,
          limit: 100,
          total: counterparties.length,
          totalPages: 1,
        },
      },
    });
  });
}

async function signIn(page: Page) {
  await page.goto('/auth/signin');
  await page.getByLabel('Email').fill(authenticatedUser.email);
  await page.getByLabel('Password', { exact: true }).fill('Password1!');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL('/dashboard');
}

test('lists transactions at the index route and preserves creation routes', async ({
  page,
}) => {
  const journalQueries: URLSearchParams[] = [];
  await registerRoutes(page, journalQueries);
  await signIn(page);

  await page.goto('/transactions');
  await expect(page).toHaveURL('/transactions');
  await expect(page.getByTestId('transactions-table')).toBeVisible();
  await expect(page.getByText('Payment to Osahon Oboite')).toBeVisible();
  await expect(page.getByText('Receipt from Acme Consulting')).toBeVisible();
  await expect(page.getByText('USD account → Main checking')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Open transaction' })
  ).toHaveCount(0);

  await expect.poll(() => journalQueries.length).toBeGreaterThan(0);
  expect(journalQueries[0].get('page')).toBe('1');
  expect(journalQueries[0].get('limit')).toBe('10');
  expect(journalQueries[0].get('orderBy')).toBe('effectiveDate');
  expect(journalQueries[0].get('sortDirection')).toBe('desc');

  await page.getByPlaceholder('Search transactions...').fill('gift');
  await page.getByRole('columnheader', { name: 'Date' }).click();
  await expect(page).toHaveURL(/q=gift/);
  await expect(page).toHaveURL(/order=asc/);
  await expect
    .poll(() => journalQueries.some((query) => query.get('search') === 'gift'))
    .toBe(true);

  await page.getByRole('link', { name: 'New transaction' }).click();
  await expect(page).toHaveURL('/transactions/inflow');
  await expect(page.getByRole('tab', { name: 'Inflow' })).toBeVisible();
});
