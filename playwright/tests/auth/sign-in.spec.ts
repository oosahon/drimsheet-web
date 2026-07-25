import { expect, test } from '@integration/fixtures/test';
import {
  authenticatedUser,
  registerAuthenticatedAppRoutes,
} from '@integration/mocks/authenticated-app';

const email = authenticatedUser.email;
const password = 'Password1!';
const loginEndpoint = '**/api/v1/auth/login-with-email';

test.beforeEach(async ({ page }) => {
  await page.goto('/auth/signin');
});

test('signs in with email and password', async ({ page }) => {
  await registerAuthenticatedAppRoutes(page);
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
