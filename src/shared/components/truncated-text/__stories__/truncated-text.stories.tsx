import { TooltipProvider } from '@/shared/components/tooltip';
import { TruncatedText } from '@/shared/components/truncated-text';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Shared UI/TruncatedText',
  component: TruncatedText,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  args: {
    maxLength: 20,
    text: 'A short description',
  },
} satisfies Meta<typeof TruncatedText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Truncated: Story = {
  args: {
    text: 'A description that exceeds the configured character limit',
  },
};

export const WithTooltip: Story = {
  args: {
    showTooltip: true,
    text: 'Hover or focus this description to read the complete value',
  },
};
