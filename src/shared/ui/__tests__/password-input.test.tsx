import { PasswordInput } from '@/shared/ui/input';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

describe('PasswordInput', () => {
  it('renders correctly', () => {
    render(<PasswordInput aria-label="Password" />);
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('has type default to password', () => {
    render(<PasswordInput aria-label="Password" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggles password visibility when the button is clicked', async () => {
    const user = userEvent.setup();
    render(<PasswordInput aria-label="Password" />);

    const input = screen.getByLabelText('Password');
    const toggleButton = screen.getByRole('button', { name: 'Show password' });

    // Initial state
    expect(input).toHaveAttribute('type', 'password');

    // Click to show password
    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
    expect(
      screen.getByRole('button', { name: 'Hide password' })
    ).toBeInTheDocument();

    // Click to hide password again
    await user.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(input).toHaveAttribute('type', 'password');
    expect(
      screen.getByRole('button', { name: 'Show password' })
    ).toBeInTheDocument();
  });

  it('passes props to the underlying input', () => {
    render(
      <PasswordInput placeholder="Enter your password" aria-label="Password" />
    );
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('placeholder', 'Enter your password');
  });
});
