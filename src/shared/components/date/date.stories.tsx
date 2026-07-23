import { FormattedDate } from '@/shared/components/date';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Shared UI/FormattedDate',
  component: FormattedDate,
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
} satisfies Meta<typeof FormattedDate>;

export default meta;
type Story = StoryObj<typeof meta>;

const testDate = new Date('2026-05-23T12:00:00Z');

export const Default: Story = {
  args: {
    value: testDate,
  },
};

export const USFormat: Story = {
  args: {
    value: testDate,
    countryCode: 'US',
  },
};

export const GBFormat: Story = {
  args: {
    value: testDate,
    countryCode: 'GB',
  },
};
