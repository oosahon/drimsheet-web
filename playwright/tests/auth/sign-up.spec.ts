import { expect, test } from '@integration/fixtures/test';

const signupEndpoint = '**/api/v1/auth/signup-with-email';

const validUserData = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  password: 'Password1!',
};

test.beforeEach(async ({ page }) => {
  await page.goto('/auth/signup');
});

test('displays validation errors when submitting empty form', async ({
  page,
}) => {
  await expect(page.getByRole('main')).toBeVisible();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Create account' })
  ).toBeVisible();

  await page.getByRole('button', { name: 'Create account' }).click();

  await expect(page.getByText('First Name is required')).toBeVisible();
  await expect(page.getByText('Last Name is required')).toBeVisible();
  await expect(page.getByText('Email is required')).toBeVisible();
  await expect(page.getByText('Password is required')).toBeVisible();
});

test('shows error toast when API returns an error', async ({ page }) => {
  await page.route(signupEndpoint, async (route) => {
    await route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({
        name: 'ConflictError',
        errorKey: 'auth_error_inconsistent_user_auth_unexpected',
        validationErrors: [],
      }),
    });
  });

  await page.getByLabel('First name').fill(validUserData.firstName);
  await page.getByLabel('Last name').fill(validUserData.lastName);
  await page.getByLabel('Email').fill(validUserData.email);
  await page
    .getByLabel('Password', { exact: true })
    .fill(validUserData.password);
  await page.getByRole('button', { name: 'Create account' }).click();

  await expect(page.getByText('Unable to verify your account.')).toBeVisible();
  await expect(page).toHaveURL('/auth/signup');
  await expect(page.getByLabel('First name')).toHaveValue(
    validUserData.firstName
  );
  await expect(page.getByLabel('Last name')).toHaveValue(
    validUserData.lastName
  );
  await expect(page.getByLabel('Email')).toHaveValue(validUserData.email);
  await expect(page.getByLabel('Password', { exact: true })).toHaveValue(
    validUserData.password
  );
});

test('displays Google authentication button', async ({ page }) => {
  await expect(
    page.getByRole('button', { name: 'Continue with Google' })
  ).toBeVisible();
});

test('navigates to sign-in page when sign-in link is clicked', async ({
  page,
}) => {
  await page.getByRole('link', { name: 'Sign in' }).click();

  await expect(page).toHaveURL('/auth/signin');
});

test('displays auth consent text with terms of service and privacy policy links', async ({
  page,
}) => {
  await expect(
    page.getByText('By creating an account, you agree to our')
  ).toBeVisible();

  const termsLink = page.getByRole('link', { name: 'Terms of Service' });
  await expect(termsLink).toBeVisible();
  await expect(termsLink).toHaveAttribute('href', '/terms-of-service');

  const privacyLink = page.getByRole('link', { name: 'Privacy Policy' });
  await expect(privacyLink).toBeVisible();
  await expect(privacyLink).toHaveAttribute('href', '/privacy-policy');
});

test('creates a new user account with email and password', async ({ page }) => {
  await page.route(signupEndpoint, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });

  const signupRequest = page.waitForRequest(signupEndpoint);

  await page.getByLabel('First name').fill(validUserData.firstName);
  await page.getByLabel('Last name').fill(validUserData.lastName);
  await page.getByLabel('Email').fill(validUserData.email);
  await page
    .getByLabel('Password', { exact: true })
    .fill(validUserData.password);
  await page.getByRole('button', { name: 'Create account' }).click();

  const request = await signupRequest;

  expect(request.postDataJSON()).toEqual(validUserData);
  await expect(page).toHaveURL('/auth/signup');
  await expect(page.getByRole('main')).toBeVisible();
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Account created successfully!',
    })
  ).toBeVisible();
  await expect(page.getByRole('status')).toHaveText(
    'Please check your email for a verification link'
  );
});

test('does not trust a success query parameter', async ({ page }) => {
  await page.goto('/auth/signup?success=true');

  await expect(
    page.getByRole('heading', { level: 1, name: 'Create account' })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Account created successfully!',
    })
  ).not.toBeVisible();
});

test('reflows without horizontal overflow at a narrow viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/auth/signup');

  const firstName = page.getByLabel('First name');
  const lastName = page.getByLabel('Last name');
  const email = page.getByLabel('Email');
  const password = page.getByLabel('Password', { exact: true });
  const submit = page.getByRole('button', { name: 'Create account' });

  for (const control of [firstName, lastName, email, password, submit]) {
    await control.scrollIntoViewIfNeeded();
    await expect(control).toBeVisible();
    const box = await control.boundingBox();
    expect(box).not.toBeNull();
    expect(box?.x).toBeGreaterThanOrEqual(0);
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(320);
  }

  const firstNameBox = await firstName.boundingBox();
  const lastNameBox = await lastName.boundingBox();

  expect(lastNameBox?.y).toBeGreaterThan(
    (firstNameBox?.y ?? 0) + (firstNameBox?.height ?? 0)
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true);
  await expect(
    page.getByText('By creating an account, you agree to our')
  ).toBeVisible();
});
