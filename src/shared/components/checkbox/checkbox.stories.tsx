import { Checkbox } from '@/shared/components/checkbox';
import { Field, FieldLabel } from '@/shared/components/field';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Shared UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field orientation="horizontal">
      <Checkbox id="terms" />
      <FieldLabel htmlFor="terms">Accept terms and conditions</FieldLabel>
    </Field>
  ),
};

export const Checked: Story = {
  args: {
    'aria-label': 'Enabled checkbox',
    defaultChecked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    'aria-label': 'Indeterminate checkbox',
    defaultChecked: 'indeterminate',
  },
};

export const Disabled: Story = {
  render: () => (
    <Field data-disabled orientation="horizontal">
      <Checkbox id="disabled-checkbox" disabled />
      <FieldLabel htmlFor="disabled-checkbox">Enable notifications</FieldLabel>
    </Field>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field data-invalid orientation="horizontal">
      <Checkbox id="invalid-checkbox" aria-invalid />
      <FieldLabel htmlFor="invalid-checkbox">
        Accept terms and conditions
      </FieldLabel>
    </Field>
  ),
};
