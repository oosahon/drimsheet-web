import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FeatureNotAvailable } from '@/shared/components/feature-not-available';

describe('FeatureNotAvailable', () => {
  it('renders the shared unavailable state and inert request access action', () => {
    render(<FeatureNotAvailable />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: "This feature isn't available to you",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Your account does not currently have access to this feature.'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Request access' })
    ).toHaveAttribute('type', 'button');
  });
});
