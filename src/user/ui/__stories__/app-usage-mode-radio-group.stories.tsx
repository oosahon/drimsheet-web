import { AppUsageModeRadioGroup } from '@/user/ui/app-usage-mode-radio-group';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'User/AppUsageModeRadioGroup',
  component: AppUsageModeRadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onChange: () => {} },
} satisfies Meta<typeof AppUsageModeRadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 'non_power_user',
  },
};

export const PowerUser: Story = {
  args: {
    value: 'power_user',
  },
};

export const WithError: Story = {
  args: {
    value: '',
    error: [{ message: 'Please select an option.' }],
  },
};
