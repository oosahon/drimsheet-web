# Dependency Rules

## Goal

Make imports predictable so the agent can change one part of the app without causing accidental coupling.

## Import Direction

- `src/_app/` may import from any feature or shared module.
- `src/<feature>/pages/` may import from that feature’s `components/`, `hooks/`, `layouts/`, `dialogs/`, and `lib/`.
- `src/<feature>/dialogs/` may import from that feature’s `components/`, `hooks/`, `layouts/`, and `lib/`.
- `src/<feature>/components/` may import only from the same feature’s `lib/`, `types`, and shared code.
- `src/<feature>/hooks/` may import from the same feature’s `lib/` and shared code.
- `src/<feature>/routes/` may import pages only.
- `src/shared/` must not import from any feature folder.

## Dependency Boundaries

- Shared code must stay feature-agnostic.
- Feature code may depend on shared code, but not the other way around.
- UI components must not reach into infrastructure concerns directly.
- Pages and dialogs may orchestrate side effects, but they should not own reusable business logic.
- Route files must remain thin and only wire URLs to pages.

## Side-Effect Placement

- Network access belongs in hooks or services, not in pure components.
- Local storage, analytics, timers, subscriptions, and DOM mutation belong outside pure components.
- Data shaping and mapping belong in `lib/` or dedicated mappers.
- Validation logic belongs in `validation.ts` unless it is shared across multiple features.

## Shared Imports

- Prefer shared imports for reusable primitives, helpers, and config.
- Do not duplicate shared logic in feature folders.
- Do not move a feature-specific implementation into shared code just because it is useful once.

## Barrel File Rules

- Use barrels only for public entry points.
- Do not create circular dependencies through barrels.
- Keep import paths explicit when a barrel would hide important dependency direction.
