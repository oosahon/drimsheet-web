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

test('exposes page landmark, level-one heading, and exact brand accessible name', async ({
  page,
}) => {
  await expect(page.getByRole('main')).toBeVisible();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Sign In' })
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Drimsheet', exact: true })
  ).toBeVisible();
});

test('navigates to forgot password and sign-up pages', async ({ page }) => {
  await page.getByRole('link', { name: 'Forgot password?' }).click();
  await expect(page).toHaveURL('/auth/forgot-password');

  await page.goto('/auth/signin');
  await page.getByRole('link', { name: 'Sign up' }).click();
  await expect(page).toHaveURL('/auth/signup');
});

test('associates validation errors with inputs via aria attributes', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Sign In' }).click();

  const emailInput = page.getByLabel('Email');
  const passwordInput = page.getByLabel('Password', { exact: true });

  await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
  await expect(emailInput).toHaveAttribute(
    'aria-describedby',
    'login-email-error'
  );
  await expect(page.locator('#login-email-error')).toHaveText(
    'Email is required'
  );

  await expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
  await expect(passwordInput).toHaveAttribute(
    'aria-describedby',
    'login-password-error'
  );
  await expect(page.locator('#login-password-error')).toHaveText(
    'Password is required'
  );
});

test('handles single-flight submission and disables controls while pending', async ({
  page,
}) => {
  let requestCount = 0;
  let fulfillRoute: () => void = () => {};

  const routePromise = new Promise<void>((resolve) => {
    fulfillRoute = resolve;
  });

  await page.route(loginEndpoint, async (route) => {
    requestCount++;
    await routePromise;
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ accessToken: 'integration-test-token' }),
    });
  });

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);

  const submitBtn = page.getByRole('button', { name: 'Sign In' });
  await submitBtn.click();

  await expect(page.getByLabel('Email')).toHaveAttribute('readonly', '');
  await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute(
    'readonly',
    ''
  );
  await expect(page.getByLabel('Email')).not.toBeDisabled();
  await expect(page.getByLabel('Password', { exact: true })).not.toBeDisabled();
  await expect(
    page.getByRole('button', { name: 'Show password' })
  ).not.toBeDisabled();
  await expect(submitBtn).toBeDisabled();

  await page.keyboard.press('Enter');
  await submitBtn.click({ force: true }).catch(() => {});

  fulfillRoute?.();

  await expect(page).toHaveURL('/dashboard');
  expect(requestCount).toBe(1);
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
  await expect(
    page.getByRole('button', {
      name: 'Open account management for Integration Entity',
    })
  ).toBeVisible();
});

test('shows invalid credentials returned by the API and preserves entered email', async ({
  page,
}) => {
  await page.route(loginEndpoint, async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({
        name: 'AuthenticationError',
        errorKey: 'auth_error_credentials_invalid_unauthorized',
        validationErrors: [],
      }),
    });
  });

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password', { exact: true }).fill('WrongPassword1!');
  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page.getByText('Invalid email or password.')).toBeVisible();
  await expect(page).toHaveURL('/auth/signin');
  await expect(page.getByLabel('Email')).toHaveValue(email);
});

test('redirects to Google authentication endpoint when Google button is clicked', async ({
  page,
}) => {
  let loginCalled = false;
  let googleCalled = false;

  await page.route(loginEndpoint, async (route) => {
    loginCalled = true;
    await route.fulfill({ status: 500 });
  });

  await page.route('**/api/v1/auth/google', async (route) => {
    googleCalled = true;
    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<html><body>Google Auth Page</body></html>',
    });
  });

  await page.getByRole('button', { name: 'Continue with Google' }).click();

  await expect.poll(() => googleCalled).toBe(true);
  expect(loginCalled).toBe(false);
});

test('reflows without horizontal overflow at narrow 320px viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 600 });
  await page.goto('/auth/signin');

  const emailInput = page.getByLabel('Email');
  const passwordInput = page.getByLabel('Password', { exact: true });
  const submitBtn = page.getByRole('button', { name: 'Sign In' });
  const googleBtn = page.getByRole('button', { name: 'Continue with Google' });

  for (const control of [emailInput, passwordInput, submitBtn, googleBtn]) {
    await control.scrollIntoViewIfNeeded();
    await expect(control).toBeVisible();
    const box = await control.boundingBox();
    expect(box).not.toBeNull();
    expect(box?.x).toBeGreaterThanOrEqual(0);
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(320);
  }

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true);
});
