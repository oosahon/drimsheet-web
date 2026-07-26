# i18n Rules

## Goal

Keep translations consistently named, clearly owned, and easy to locate in
components and locale resources.

## Translation Keys

- Use flat `snake_case` keys in JSON locale files.
- Name keys by meaning and UI role, not by their English wording, for example
  `password_reset_description` or `email_placeholder`.

## Ownership and Namespaces

- Feature-owned translations belong in
  `src/<feature>/i18n/locales/<locale>/<namespace>.json`.
- Shared translations belong in `src/shared/i18n/` only when they are genuinely
  reused across independent features.
- Prefer one namespace per feature.
- Additional namespaces are allowed for coherent subdomains or cross-cutting
  resources, such as `ledger-accounts` or `api-errors`.
- The JSON filename must match the registered i18next namespace.
- Translation registration and initialization belong in `src/_app/i18n/`.

## React Usage

- Extract render-only translations into variables immediately before the
  returned UI. Do not call `t()` directly inside JSX.
- Use descriptive `snake_case` variable names with a semantic suffix where
  appropriate, such as `_text`, `_label`, `_title`, `_description`,
  `_placeholder`, or `_aria_label`.
- Translations used only in handlers, callbacks, loops, or dynamic mappings may
  be translated at the point of use when extraction would reduce locality.
- Any error text that can be shown to a user must come from i18n.
- This includes validation messages, toast copy, dialog errors, error boundary
  fallbacks, and API error fallbacks.
- Plain text error strings are allowed only for logs, telemetry, developer
  assertions, and other debug-only output that never reaches production UI.
- Before introducing new user-facing error copy, add or reuse a translation key
  in the owning namespace rather than hard-coding English in components or
  validation schemas.

**Incorrect:**

```tsx
<FieldSeparator>{t('shared:or_text')}</FieldSeparator>
```

**Correct:**

```tsx
const or_text = t('shared:or_text');

// ...
<FieldSeparator>{or_text}</FieldSeparator>;
```
