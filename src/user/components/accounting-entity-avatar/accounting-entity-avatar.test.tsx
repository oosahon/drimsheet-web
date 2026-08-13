import { AccountingEntityAvatar } from '@/user/components/accounting-entity-avatar';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('AccountingEntityAvatar', () => {
  it.each([
    ['Purple Ledger', 'PL'],
    ['  Purple   Ledger Limited  ', 'PL'],
    ['Purple', 'PU'],
    ['', '?'],
    ['   ', '?'],
  ])('renders initials for %j', (name, expected) => {
    render(<AccountingEntityAvatar name={name} />);

    expect(screen.getByText(expected)).toBeInTheDocument();
  });
});
