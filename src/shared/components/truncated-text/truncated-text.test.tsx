import { TooltipProvider } from '@/shared/components/tooltip';
import { TruncatedText } from '@/shared/components/truncated-text';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { describe, expect, it } from 'vitest';

function renderTruncatedText(
  props: Readonly<ComponentProps<typeof TruncatedText>>
) {
  return render(
    <TooltipProvider>
      <TruncatedText {...props} />
    </TooltipProvider>
  );
}

describe('TruncatedText', () => {
  it('keeps text at the exact character limit unchanged', () => {
    renderTruncatedText({ maxLength: 5, text: '12345' });

    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.queryByText('12345…')).not.toBeInTheDocument();
  });

  it('truncates text beyond the character limit', () => {
    renderTruncatedText({ maxLength: 5, text: '123456' });

    expect(screen.getByText('12345…')).toBeInTheDocument();
  });

  it('does not show a tooltip by default', async () => {
    const user = userEvent.setup();
    renderTruncatedText({ maxLength: 5, text: '123456' });

    await user.hover(screen.getByText('12345…'));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows the full text in a tooltip when enabled', async () => {
    const user = userEvent.setup();
    renderTruncatedText({
      maxLength: 5,
      showTooltip: true,
      text: '123456',
    });

    await user.hover(screen.getByText('12345…'));

    expect(await screen.findByRole('tooltip')).toHaveTextContent('123456');
  });
});
