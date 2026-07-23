import { AuthConsent } from '@/auth/components/auth-consent';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('AuthConsent', () => {
  it('renders correctly with default action text', () => {
    render(<AuthConsent />);

    expect(
      screen.getByText(/By creating an account, you agree to our/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Terms of Service/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Privacy Policy/i })
    ).toBeInTheDocument();
  });

  it('renders correctly with custom action text', () => {
    render(<AuthConsent actionText="signing up" />);

    expect(
      screen.getByText(/By signing up, you agree to our/i)
    ).toBeInTheDocument();
  });
});
