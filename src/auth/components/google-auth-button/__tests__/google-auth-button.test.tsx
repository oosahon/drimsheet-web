import { GoogleAuthButton } from '@/auth/components/google-auth-button';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('GoogleAuthButton', () => {
  it('renders correctly with default text', () => {
    render(<GoogleAuthButton />);

    expect(
      screen.getByRole('button', { name: /Continue with Google/i })
    ).toBeInTheDocument();
  });

  it('triggers onClick handler when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<GoogleAuthButton onClick={handleClick} />);

    await user.click(
      screen.getByRole('button', { name: /Continue with Google/i })
    );

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('forwards additional button props', () => {
    render(<GoogleAuthButton disabled />);

    expect(
      screen.getByRole('button', { name: /Continue with Google/i })
    ).toBeDisabled();
  });
});
