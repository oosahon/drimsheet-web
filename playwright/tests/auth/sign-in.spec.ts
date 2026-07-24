import type { IAccountingEntity, IUser, TEntityId } from '@/shared/lib/api/Api';
import { expect, test } from '@integration/fixtures/test';

const email = 'integration.user@example.com';
const password = 'Password1!';
const loginEndpoint = '**/api/v1/auth/login-with-email';
const timestamp = '2026-01-01T00:00:00.000Z';

const user = {
  id: '00000000-0000-4000-8000-000000000001' as TEntityId,
  email,
  emailVerified: true,
  firstName: 'Integration',
  lastName: 'User',
  createdAt: timestamp,
  updatedAt: timestamp,
  deletedAt: null,
} satisfies IUser;

const accountingEntity = {
  id: '00000000-0000-4000-8000-000000000002' as TEntityId,
  name: 'Integration Entity',
  type: 'individual',
  ownerId: user.id,
  functionalCurrencyCode: 'NGN',
  jurisdictionCode: 'NG',
  createdAt: timestamp,
  updatedAt: timestamp,
} satisfies IAccountingEntity;

test.beforeEach(async ({ page }) => {
  await page.goto('/auth/signin');
});

test('signs in with email and password', async ({ page }) => {
  await page.route('**/api/v1/users/profile', async (route) => {
    await route.fulfill({ json: user });
  });
  await page.route(
    '**/api/v1/accounting/accounting-entities',
    async (route) => {
      await route.fulfill({ json: [accountingEntity] });
    }
  );
  await page.route(loginEndpoint, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ accessToken: 'integration-test-token' }),
    });
  });

  const loginRequest = page.waitForRequest(loginEndpoint);

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();

  const request = await loginRequest;

  expect(request.postDataJSON()).toEqual({ email, password });
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText(email)).toBeVisible();
});

test('shows invalid credentials returned by the API', async ({ page }) => {
  await page.route(loginEndpoint, async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({
        name: 'AuthenticationError',
        errorKey: 'auth_error_invalid_credentials',
        validationErrors: [],
      }),
    });
  });

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill('WrongPassword1!');
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page.getByText('Invalid email or password')).toBeVisible();
  await expect(page).toHaveURL('/auth/signin');
});
