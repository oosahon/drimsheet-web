import { JournalEntryNotFound } from '@/journal-entries/components/journal-entry-not-found';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('JournalEntryNotFound', () => {
  it('renders the 404 state and emits the return action', async () => {
    const user = userEvent.setup();
    const onBack = vi.fn();

    render(<JournalEntryNotFound onBack={onBack} />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Journal entry not found')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Back to transactions' })
    );

    expect(onBack).toHaveBeenCalledOnce();
  });
});
