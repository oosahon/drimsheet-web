import { ELedgerAccountBehavior } from '@/shared/lib/api/Api';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AccountBehaviorNote } from './account-behavior-note';

describe('AccountBehaviorNote', () => {
  it('explains petty cash behavior', () => {
    render(<AccountBehaviorNote behavior={ELedgerAccountBehavior.PettyCash} />);

    expect(
      screen.getByText(
        'Tracks small, routine purchases paid from an on-hand cash fund.'
      )
    ).toBeInTheDocument();
  });

  it('explains bank behavior', () => {
    render(<AccountBehaviorNote behavior={ELedgerAccountBehavior.Bank} />);

    expect(
      screen.getByText(
        'Tracks money held at a bank or financial institution, including deposits, withdrawals, and transfers.'
      )
    ).toBeInTheDocument();
  });

  it.each(Object.values(ELedgerAccountBehavior))(
    'provides content for %s',
    (behavior) => {
      const { unmount } = render(<AccountBehaviorNote behavior={behavior} />);

      expect(screen.getByRole('alert')).toHaveTextContent(
        'About this account type'
      );
      unmount();
    }
  );
});
