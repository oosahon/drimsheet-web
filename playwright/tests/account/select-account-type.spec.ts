import { expect, test } from '@integration/fixtures/test';
import {
  authenticatedUser,
  registerAuthenticatedAppRoutes,
} from '@integration/mocks/authenticated-app';
import type { Page } from '@playwright/test';

const loginEndpoint = '**/api/v1/auth/login-with-email';
const refreshEndpoint = '**/api/v1/auth/refresh-access-token';
const ledgerAccountsEndpoint = '**/api/v1/ledger*';
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

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole('heading', { name: /select account type/i }).first()
    ).toBeVisible();

    await expect(
      dialog.getByRole('radio', { name: /bank account/i })
    ).toBeVisible();
    await expect(
      dialog.getByRole('radio', { name: /petty cash/i })
    ).toBeVisible();
    await expect(
      dialog.getByRole('radio', { name: /virtual account/i })
    ).toBeVisible();
    await expect(
      dialog.getByRole('radio', { name: /credit card/i })
    ).toBeVisible();

    // Dismissal test via Escape
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();

    // Reopen and submit choice
    await addAccountButton.click();
    await expect(dialog).toBeVisible();

    await dialog.getByRole('radio', { name: /petty cash/i }).click();

    const continueButton = dialog.getByRole('button', { name: /continue/i });
    await expect(continueButton).toBeEnabled();
    await continueButton.click();

    await expect(dialog).not.toBeVisible();
  });
});
