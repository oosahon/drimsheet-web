import { SignupForm } from '@/auth/ui/signup-form';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('SignupForm', () => {
  it('renders correctly', () => {
    render(<SignupForm onSubmit={vi.fn()} loading={false} />);
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
  });

  it('shows required validation errors on submit empty', async () => {
    const user = userEvent.setup();
    render(<SignupForm onSubmit={vi.fn()} loading={false} />);

    await user.click(screen.getByRole('button', { name: /Create Account/i }));

    expect(
      await screen.findByText(/First Name is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Last Name is required/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/Password is required/i)
    ).toBeInTheDocument();
  });

  describe('Password Validation', () => {
    it('requires at least 8 characters', async () => {
      const user = userEvent.setup();
      render(<SignupForm onSubmit={vi.fn()} loading={false} />);

      await user.type(screen.getByLabelText(/^Password$/i), 'Short1!');
      await user.click(screen.getByRole('button', { name: /Create Account/i }));

      expect(
        await screen.findByText(/Password must be at least 8 characters/i)
      ).toBeInTheDocument();
    });

    it('requires at least one number', async () => {
      const user = userEvent.setup();
      render(<SignupForm onSubmit={vi.fn()} loading={false} />);

      await user.type(screen.getByLabelText(/^Password$/i), 'NoNumbers!');
      await user.click(screen.getByRole('button', { name: /Create Account/i }));

      expect(
        await screen.findByText(/Password must contain at least one number/i)
      ).toBeInTheDocument();
    });

    it('requires at least one special character', async () => {
      const user = userEvent.setup();
      render(<SignupForm onSubmit={vi.fn()} loading={false} />);

      await user.type(screen.getByLabelText(/^Password$/i), 'NoSpecialChar1');
      await user.click(screen.getByRole('button', { name: /Create Account/i }));

      expect(
        await screen.findByText(
          /Password must contain at least one special character/i
        )
      ).toBeInTheDocument();
    });

    it('accepts valid passwords', async () => {
      const user = userEvent.setup();
      render(<SignupForm onSubmit={vi.fn()} loading={false} />);

      await user.type(screen.getByLabelText(/First Name/i), 'John');
      await user.type(screen.getByLabelText(/Last Name/i), 'Doe');
      await user.type(screen.getByLabelText(/Email/i), 'john.doe@example.com');
      await user.type(screen.getByLabelText(/^Password$/i), 'Valid1Password!');

      await user.click(screen.getByRole('button', { name: /Create Account/i }));

      await waitFor(() => {
        expect(screen.queryByText(/Password must/i)).not.toBeInTheDocument();
      });
    });
  });
});
