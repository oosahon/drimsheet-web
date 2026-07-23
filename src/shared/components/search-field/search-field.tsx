import { FieldLabel } from '@/shared/components/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/shared/components/input-group';
import { Search } from 'lucide-react';

interface SearchFieldProps extends React.ComponentProps<'input'> {
  fieldLabelProps?: React.ComponentProps<typeof FieldLabel>;
}

export function SearchField({ ...inputProps }: Readonly<SearchFieldProps>) {
  return (
    <InputGroup>
      <InputGroupAddon>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroupAddon>

      <InputGroupInput {...inputProps} />
    </InputGroup>
  );
}
