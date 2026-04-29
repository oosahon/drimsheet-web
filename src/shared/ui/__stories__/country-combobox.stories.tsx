import uiCountries from '@/shared/config/countries.json' with { type: 'json' };
import { CountryComboBox } from '@/shared/ui/country-combobox';
import type { IAccountingStandardDto } from '@/shared/utils/api/Api';
import type { Meta, StoryObj } from '@storybook/react-vite';

const dummyCountriesData = uiCountries.map((c) => ({
  code: c.code,
  name: c.name,
  currencyCode: c.currencyCode,
  accountingStandards: {} as IAccountingStandardDto,
}));

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
  args: { label: 'Country', value: '', countriesData: dummyCountriesData },
};
