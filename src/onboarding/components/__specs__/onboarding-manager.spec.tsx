import useAccountingEntities from '@/accounting-entity/hooks/use-accounting-entities';
import OnboardingManager from '@/onboarding/components/onboarding-manager';
import type { IAccountingEntityRes } from '@/shared/utils/api/Api';
import type { UseQueryResult } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/onboarding/components/accounting-onboarding-form', () => {
  return {
    __esModule: true,
    default: ({ open }: { open: boolean }) => (
      <div data-testid="accounting-onboarding-form" data-open={open} />
    ),
  };
});

vi.mock('@/accounting-entity/hooks/use-accounting-entities', () => {
  return {
    __esModule: true,
    default: vi.fn(),
  };
});

describe('OnboardingManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when entities are loading', () => {
    vi.mocked(useAccountingEntities).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as UseQueryResult<IAccountingEntityRes[], Error>);

    const { container } = render(<OnboardingManager />);
    expect(container.firstChild).toBeNull();
  });

  it('opens AccountingOnboardingFormContainer when loading completes and entities are empty', () => {
    vi.mocked(useAccountingEntities).mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as UseQueryResult<IAccountingEntityRes[], Error>);

    render(<OnboardingManager />);

    const form = screen.getByTestId('accounting-onboarding-form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute('data-open', 'true');
  });

  it('does not open AccountingOnboardingFormContainer when loading completes and entities exist', () => {
    vi.mocked(useAccountingEntities).mockReturnValue({
      data: [{ id: 'entity-1', name: 'My Entity' }],
      isLoading: false,
    } as unknown as UseQueryResult<IAccountingEntityRes[], Error>);

    render(<OnboardingManager />);

    const form = screen.getByTestId('accounting-onboarding-form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute('data-open', 'false');
  });
});
