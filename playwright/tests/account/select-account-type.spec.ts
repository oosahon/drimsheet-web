import type { IPettyCashAccountCreationReq } from '@/shared/lib/api/Api';
import { expect, test } from '@integration/fixtures/test';
import {
  authenticatedUser,
  registerAuthenticatedAppRoutes,
} from '@integration/mocks/authenticated-app';
import type { Page } from '@playwright/test';

const loginEndpoint = '**/api/v1/auth/login-with-email';
const refreshEndpoint = '**/api/v1/auth/refresh-access-token';
const ledgerAccountsEndpoint = '**/api/v1/ledger*';
const createPettyCashEndpoint = '**/api/v1/ledger/asset/petty-cash';
const currenciesEndpoint = '**/api/v1/currencies*';

async function registerAccountPageRoutes(page: Page) {
  await registerAuthenticatedAppRoutes(page);

  await page.route(refreshEndpoint, async (route) => {
    await route.fulfill({
      status: 200,
      json: { accessToken: 'integration-test-token' },
    });
  });

  await page.route(loginEndpoint, async (route) => {
    await route.fulfill({
      status: 200,
      json: { accessToken: 'integration-test-token' },
    });
  });

  await page.route(currenciesEndpoint, async (route) => {
    await route.fulfill({
      json: [
        { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', minorUnit: 2 },
        { code: 'USD', name: 'US Dollar', symbol: '$', minorUnit: 2 },
      ],
    });
  });

  await page.route(ledgerAccountsEndpoint, async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        json: {
          data: [],
          meta: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        },
      });
    } else {
      await route.fallback();
    }
  });
}

async function signInAndNavigateToAccounts(page: Page) {
  await registerAccountPageRoutes(page);

  await page.goto('/auth/signin');
  await page.getByLabel('Email').fill(authenticatedUser.email);
  await page.getByLabel('Password', { exact: true }).fill('Password1!');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL('/dashboard');

  await page.goto('/accounts');
  await expect(page).toHaveURL('/accounts');
}

test.describe('Account Type Selection Flow', () => {
  test('opens account type selector from Add account button, handles dismissal and selection', async ({
    page,
  }) => {
    await signInAndNavigateToAccounts(page);

    const addAccountButton = page.getByRole('button', { name: 'Add account' });
    await expect(addAccountButton).toBeVisible();
    await addAccountButton.click();

    const selectionDialog = page.getByRole('dialog').filter({
      has: page.getByRole('heading', { name: /select account type/i }),
    });
    await expect(selectionDialog).toBeVisible();

    await expect(
      selectionDialog.getByRole('radio', { name: /bank account/i })
    ).toBeVisible();
    await expect(
      selectionDialog.getByRole('radio', { name: /petty cash/i })
    ).toBeVisible();
    await expect(
      selectionDialog.getByRole('radio', { name: /virtual account/i })
    ).toBeVisible();
    await expect(
      selectionDialog.getByRole('radio', { name: /credit card/i })
    ).toBeVisible();

    // Dismissal test via Escape
    await page.keyboard.press('Escape');
    await expect(selectionDialog).not.toBeVisible();

    // Reopen selector
    await addAccountButton.click();
    await expect(selectionDialog).toBeVisible();

    // Select Petty cash
    await selectionDialog.getByRole('radio', { name: /petty cash/i }).click();

    const continueButton = selectionDialog.getByRole('button', {
      name: /continue/i,
    });
    await expect(continueButton).toBeEnabled();
    await continueButton.click();

    // Selection dialog closes, Petty Cash dialog opens
    await expect(selectionDialog).not.toBeVisible();

    const pettyCashDialog = page.getByRole('dialog').filter({
      has: page.getByRole('heading', { name: /create petty cash account/i }),
    });
    await expect(pettyCashDialog).toBeVisible();

    // Test dismissal of Petty Cash dialog via Escape
    await page.keyboard.press('Escape');
    await expect(pettyCashDialog).not.toBeVisible();

    // Reopen from Add account -> Select Petty cash -> Continue
    await addAccountButton.click();
    await expect(selectionDialog).toBeVisible();
    await selectionDialog.getByRole('radio', { name: /petty cash/i }).click();
    await continueButton.click();
    await expect(pettyCashDialog).toBeVisible();

    // Intercept POST creation request and verify payload
    let capturedRequestBody: IPettyCashAccountCreationReq | null = null;
    await page.route(createPettyCashEndpoint, async (route) => {
      if (route.request().method() === 'POST') {
        capturedRequestBody = JSON.parse(route.request().postData() ?? '{}');
        await route.fulfill({
          status: 201,
          json: { id: 'new-petty-cash-account' },
        });
      } else {
        await route.fallback();
      }
    });

    // Fill form fields
    await pettyCashDialog
      .getByRole('textbox', { name: 'Account name' })
      .fill('Main Office Cash');
    await pettyCashDialog
      .getByRole('textbox', { name: 'Opening balance' })
      .fill('500');

    // Select opening date via DateInput calendar popover
    await pettyCashDialog
      .getByRole('button', { name: /opening date/i })
      .click();
    await page.getByRole('gridcell', { name: '15' }).first().click();

    // Submit form
    const createButton = pettyCashDialog.getByRole('button', {
      name: /create account/i,
    });
    await expect(createButton).toBeEnabled();
    await createButton.click();

    // Assert success feedback toast and dialog closure
    await expect(
      page.getByText('Petty cash account created successfully')
    ).toBeVisible();
    await expect(pettyCashDialog).not.toBeVisible();

    // Assert request payload sent to backend
    expect(capturedRequestBody).toMatchObject({
      name: 'Main Office Cash',
      currencyCode: 'NGN',
      isControlAccount: false,
      openingBalance: {
        amount: {
          amount: 500,
          currencyCode: 'NGN',
          isMinorUnit: false,
        },
        date: expect.stringMatching(/^\d{4}-\d{2}-15$/),
        exchangeRate: null,
      },
    });
  });
});
