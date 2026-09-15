# Type Naming Rules

## Goal

Make a type's role visible at every declaration and import.

## Prefixes

- Prefix interfaces with `I`, for example `IAccountCreationFormValues`.
- Prefix enums and enum-like constant types with `E`, for example
  `EAccountStatus`.
- Prefix general type aliases with `T`, for example `TAccountTableRow`.
- Prefix union types with `U`, for example `UAccountBehavior`.
- Types whose names end in `Props` are the only exception. Do not prefix them,
  for example `AccountCreationFormProps`.

Apply the convention to public and private types. Do not rename generated API
types; use their generated names as the source contract.

## Derived Contracts

- Prefer `Pick` when a type supports a deliberate subset of another contract.
- Use `Omit` only when the derived type intentionally supports every present
  and future field except the named exclusions.
- Do not use `Omit` as a shortcut when an explicit `Pick` would make the public
  surface safer and easier to review.

## Examples

```ts
interface IAccountCreationFormValues {
  name: string;
}

type TAccountLookup = Record<string, IAccountCreationFormValues>;
type UAccountKind = 'bank' | 'petty_cash';

interface AccountCreationFormProps {
  onSubmit: (values: IAccountCreationFormValues) => void;
}
```
