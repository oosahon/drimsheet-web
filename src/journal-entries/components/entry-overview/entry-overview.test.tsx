import { EntryOverview } from '@/journal-entries/components/entry-overview';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('EntryOverview', () => {
  it('invokes the caller-provided edit action', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(
      <EntryOverview
        title="Consulting payment"
        amount="₦1,000"
        menuItems={[{ label: 'Edit', onSelect: onEdit }]}
      />
    );

    await user.click(
      screen.getByRole('button', { name: 'Open entry actions' })
    );
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }));

    expect(onEdit).toHaveBeenCalledOnce();
  });
});
