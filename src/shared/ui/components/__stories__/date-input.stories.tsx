import { DateInput } from '@/shared/ui/components/date-input';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Shared UI/DateInput',
  component: DateInput,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Select date',
  },
};

export const WithValue: Story = {
  args: {
    value: '2026-06-03',
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Pick a start date',
  },
};

export const Disabled: Story = {
  args: {
    value: '2026-06-03',
    disabled: true,
  },
};

export const WithCountryCode: Story = {
  name: 'Locale — Nigeria (NG)',
  args: {
    value: '2026-06-03',
    countryCode: 'NG',
  },
};

export const WithDisabledDates: Story = {
  name: 'Disabled past dates',
  args: {
    placeholder: 'Future dates only',
    disabledDates: { before: new Date() },
  },
};
