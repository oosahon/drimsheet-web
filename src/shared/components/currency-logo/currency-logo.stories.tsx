import { CurrencyLogo } from '@/shared/components/currency-logo';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Shared UI/CurrencyLogo',
  component: CurrencyLogo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-8 bg-background border border-border rounded-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CurrencyLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithUrl: Story = {
  args: {
    url: 'https://flagcdn.com/w80/us.png',
  },
};
