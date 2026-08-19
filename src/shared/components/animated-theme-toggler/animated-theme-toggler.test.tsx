import { AnimatedThemeToggler } from '@/shared/components/animated-theme-toggler';
import { EAppThemePreference } from '@/shared/lib/api/Api';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('AnimatedThemeToggler', () => {
  beforeEach(() => {
    document.documentElement.classList.add('dark');
    localStorage.clear();
  });

  it('applies and emits the resolved theme when toggled', async () => {
    const onThemeChange = vi.fn();
    const user = userEvent.setup();
    render(<AnimatedThemeToggler showText onThemeChange={onThemeChange} />);

    expect(
      screen.getByRole('button', { name: /Toggle theme/ })
    ).toHaveTextContent('Switch to light');

    await user.click(screen.getByRole('button', { name: /Toggle theme/ }));

    expect(document.documentElement).not.toHaveClass('dark');
    expect(localStorage.getItem('theme')).toBe(EAppThemePreference.Light);
    expect(onThemeChange).toHaveBeenCalledOnce();
    expect(onThemeChange).toHaveBeenCalledWith(EAppThemePreference.Light);
  });
});
