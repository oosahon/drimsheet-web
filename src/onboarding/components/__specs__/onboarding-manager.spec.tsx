import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import OnboardingManager from "../onboarding-manager";
import useAccountingEntities from "@/accounting-entity/hooks/use-accounting-entities";

vi.mock("@/onboarding/components/accounting-onboarding-form", () => {
  return {
    __esModule: true,
    default: ({ open }: { open: boolean }) => (
      <div data-testid="accounting-onboarding-form" data-open={open} />
    ),
  };
});

vi.mock("@/accounting-entity/hooks/use-accounting-entities", () => {
  return {
    __esModule: true,
    default: vi.fn(),
  };
});

describe("OnboardingManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when entities are loading", () => {
    vi.mocked(useAccountingEntities).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    const { container } = render(<OnboardingManager />);
    expect(container.firstChild).toBeNull();
  });

  it("opens AccountingOnboardingFormContainer when loading completes and entities are empty", () => {
    vi.mocked(useAccountingEntities).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    render(<OnboardingManager />);

    const form = screen.getByTestId("accounting-onboarding-form");
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute("data-open", "true");
  });

  it("does not open AccountingOnboardingFormContainer when loading completes and entities exist", () => {
    vi.mocked(useAccountingEntities).mockReturnValue({
      data: [{ id: "entity-1", name: "My Entity" }],
      isLoading: false,
    } as any);

    render(<OnboardingManager />);

    const form = screen.getByTestId("accounting-onboarding-form");
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute("data-open", "false");
  });
});
