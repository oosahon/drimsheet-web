import { CountryComboBox } from '@/shared/ui/country-combobox';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Shared UI/CountryComboBox',
  component: CountryComboBox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { onChange: () => {} },
} satisfies Meta<typeof CountryComboBox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Country', value: '' },
};
