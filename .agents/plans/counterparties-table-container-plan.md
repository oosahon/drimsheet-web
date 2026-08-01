# Counterparties Table Container Plan

## Goal

Create an implementation-ready plan to add the missing counterparties table orchestration, matching the pattern in `src/account/components/accounts-table/accounts-table.container.tsx`, and wire the result into `src/counterparty/pages/counterparties.tsx`.

The generated API already includes the counterparties list endpoint and query contract, so implementation can proceed without an API generation step. Preserve unrelated staged and working-tree changes during implementation.

## Context

The account feature already demonstrates the desired table orchestration in `src/account/components/accounts-table/accounts-table.container.tsx`: it reads table state from `useTableQueryParams`, debounces search input, builds a generated API query, calls a feature hook, keeps row-selection state locally, applies UI-only status filtering, and passes data, pagination, search, sort, filter, and add callbacks into the pure table.

`src/counterparty/components/counterparties-table/counterparties-table.tsx` already provides the presentational table. It accepts data, loading state, selection state, pagination, sort/filter/search handlers, current filters, and `onAddCounterparty`.

`src/counterparty/pages/counterparties.tsx` currently renders a label and a standalone create button, then orchestrates the role-selection and creation dialogs. It should instead render the table container and pass the existing role-selection opener as the add callback.

## Confirmed Findings

1. **Missing container implementation.** `src/counterparty/components/counterparties-table/counterparties-table.container.tsx` exists but is empty, so no data-access orchestration is currently available for the table.
2. **Generated API supports listing counterparties.** `src/shared/lib/api/Api.ts` includes `IGetCounterpartiesQuery`, `IPaginatedResponseICounterpartyDto`, `UCounterpartySortBy`, and `purpleLedgerApi.counterparties.getCounterparties(query)`.
3. **Counterparty service lacks the list operation.** `src/counterparty/lib/services/counterparty.service.ts` currently exposes create operations only.
4. **Counterparty hooks lack a list hook.** `src/counterparty/hooks/` has create hooks and label hooks, but no `use-counterparties.ts`.
5. **API sort support is narrower than the table UI.** `ECounterpartySortBy` only supports `createdAt` and `name`, while `CounterpartiesTable` currently exposes additional sortable UI columns. The UI should remain unchanged; unsupported UI sort keys should be handled by mapping before the API request is made.
6. **API filter shape differs by field.** `IGetCounterpartiesQuery` accepts `roles?: UCounterpartyRole[]`, `type?: UCounterpartyType`, and `status?: UCounterpartyStatus`; `useTableQueryParams` returns every filter as an array. This transformation belongs in an explicit mapper.

## Scope

### Expected Changes

- `src/counterparty/lib/services/counterparty.service.ts` — add `getCounterparties(query: IGetCounterpartiesQuery)` using `purpleLedgerApi.counterparties.getCounterparties(query)` and returning `response.data`.
- `src/counterparty/lib/mappers/counterparty.mapper.ts` — add an explicit mapper for table query state to `IGetCounterpartiesQuery`, including supported sort-key mapping and filter shape conversion.
- `src/counterparty/lib/mappers/counterparty.mapper.test.ts` — cover the new query mapper’s complete destination contract for search, pagination, supported and unsupported sort keys, singular filters, and role filters.
- `src/counterparty/hooks/use-counterparties.ts` — add a React Query hook with a stable query key such as `['counterpartyService.getCounterparties', query]`.
- `src/counterparty/components/counterparties-table/counterparties-table.container.tsx` — implement the container matching the accounts table pattern.
- `src/counterparty/components/counterparties-table/index.ts` — export the container through the component folder public API.
- `src/counterparty/pages/counterparties.tsx` — replace the placeholder label/button with `CounterpartiesTableContainer`, passing `onAddCounterparty={() => setShowRoleSelection(true)}` and preserving the existing dialog orchestration.

### Conditional Changes

- `src/counterparty/components/counterparties-table/counterparties-table.container.test.tsx` — add a focused container test if the project’s existing test setup can cheaply mock React Query/service boundaries for URL-param orchestration.
- `src/counterparty/pages/counterparties.tsx` Playwright coverage — add browser integration only if there is already counterparty route coverage or this work is expected to validate route-level table loading and add-dialog behavior.

### Out of Scope

- Changing counterparty create dialogs or form validation.
- Adding archive/edit row actions for the ellipsis menu.
- Regenerating API clients.
- Reworking shared `DataTable` or `useTableQueryParams`.

## Proposed Approach

### 1. Add List Data Access

- Extend `counterpartyService` with `getCounterparties(query: IGetCounterpartiesQuery)`.
- Import generated types from `@/shared/lib/api/Api`.
- Keep the service as the feature-owned boundary for API calls, consistent with existing create methods.

Expected result: the feature has a reusable service method for the generated `GET /counterparties` endpoint.

### 2. Add Query Mapper

- Extend `counterpartyMapper` in `src/counterparty/lib/mappers/counterparty.mapper.ts` with a table-query-to-API-query mapper.
- Keep the mapper deterministic and validation-free.
- Assign every `IGetCounterpartiesQuery` destination field explicitly; do not spread table state into the request.
- Map only API-supported sort keys:
  - `name -> 'name'`
  - `createdAt -> 'createdAt'`
  - unsupported UI sort keys, such as `status` or `type`, produce `orderBy: undefined`
- Convert table filter arrays to the generated API shape:
  - `status` uses the first selected status value when present
  - `type` uses the first selected type value when present
  - `roles` sends all selected roles when present
- Add mapper test coverage for the full output object in meaningful branches.

Expected result: the container stays thin, the presentational table remains unchanged, and all UI-to-API query shape decisions are centralized in the feature mapper.

### 3. Add Query Hook

- Create `src/counterparty/hooks/use-counterparties.ts`.
- Use `useQuery` from `@tanstack/react-query`.
- Accept an `IGetCounterpartiesQuery` argument and call `counterpartyService.getCounterparties(query)`.
- Use a query key that includes the full query object so search, sort, filter, and pagination changes refetch correctly.

Expected result: containers and future feature code can consume paginated counterparties without touching the service directly.

### 4. Implement `CounterpartiesTableContainer`

- Import `CounterpartiesTable`, `useCounterparties`, `useDebounce`, `useTableQueryParams`, and `counterpartyMapper`.
- Define `CounterpartiesTableContainerProps` with `onAddCounterparty: () => void`.
- Initialize table query params with `filterKeys: ['status', 'type', 'roles']`.
- Debounce `tableQuery.searchQuery` by `300` ms.
- Keep `selectedRowIds` in local component state.
- Use `limit = 10`, matching accounts.
- Build the API query with `useMemo` by calling the new mapper with:
  - `search: debouncedSearchQuery || undefined`
  - `page: tableQuery.page`
  - `limit`
  - `sortKey: tableQuery.sortKey`
  - `sortDirection: tableQuery.sortDirection`
  - `filters: tableQuery.filters`
- Call `useCounterparties(query)`.
- Pass `counterpartiesData?.data ?? []`, `counterpartiesData?.meta`, loading, selection handlers, search/sort/filter handlers, current sort state, filters, pagination handler, and `onAddCounterparty` into `CounterpartiesTable`.

Expected result: the table becomes URL-driven and server-backed while keeping the presentational component side-effect free.

### 5. Preserve UI While Mapping API Constraints

- Do not change `CounterpartiesTable` column definitions or user-facing sort/filter controls as part of this work.
- Let the mapper translate UI state into the supported generated API contract.
- Unsupported sort keys should never be sent to the API as `orderBy`.

Expected result: no invalid `orderBy` values are sent to the API, and the table UI remains unchanged.

### 6. Wire Page Composition

- Import `CounterpartiesTableContainer` from `@/counterparty/components/counterparties-table`.
- Remove the standalone label `<div>` and create `<Button>` from the page body.
- Render `CounterpartiesTableContainer` before the dialogs.
- Pass the existing role-selection opener through `onAddCounterparty`.
- Remove now-unused `Button` import and create-button translation variable.

Expected result: the page displays the real counterparties table and the table’s add button opens the existing role-selection flow.

## Test Plan

- **Mapper:** extend `src/counterparty/lib/mappers/counterparty.mapper.test.ts` to verify the new table-query-to-API-query mapper assigns the complete generated query contract explicitly for search, pagination, supported sort keys, unsupported sort keys, singular filters, and role filters.
- **Unit or component:** keep existing `CounterpartiesTable` tests green with no UI behavior changes.
- **Container:** add `counterparties-table.container.test.tsx` if focused coverage is practical. Verify the container calls the list hook with debounced search, pagination, supported sort mapping, and filter mapping from URL state, and renders table data returned by the hook.
- **Browser integration:** optional for this scoped change. Add Playwright coverage only when validating the full `/counterparties` route behavior is part of the delivery expectation; mock `GET /counterparties`, assert rows render, and assert the table add button opens the role-selection dialog.
- **Regression:** ensure existing create-dialog flow still opens from the add counterparty button after page rewiring.

## Verification

```bash
npm run check:structure
npm run test -- src/counterparty/lib/mappers/counterparty.mapper.test.ts
npm run test -- src/counterparty/components/counterparties-table
npm run build
```

If container or route-level tests are added, include their focused commands before the broader build. Playwright verification depends on the local browser/test setup and should use `npm run test:integration` only if browser integration coverage is added.

## Assumptions

- The generated `GET /counterparties` endpoint applies `status`, `type`, and `roles` filters server-side according to `IGetCounterpartiesQuery`.
- Selecting multiple `status` or `type` values should use the first selected value unless the API is updated to accept arrays, because the generated contract currently accepts only one `status` and one `type`.
- Role filtering may send multiple roles because the generated contract accepts `roles?: UCounterpartyRole[]`.

## Open Decisions

- **How to map multi-select UI for singular API filters.** Option A: keep the table filter UI unchanged and have the mapper send only the first selected `status` and `type`; this is smallest and preserves the current UI. Option B: wait for an API contract that accepts arrays for these filters; this avoids first-value behavior but blocks the table integration.

## Risks

- **Filter mismatch risk:** `useTableQueryParams` stores filters as arrays, but the API accepts singular `status` and `type`. Mitigate by documenting and testing explicit first-value mapping in `counterpartyMapper`.
- **Stale list after creation:** create hooks may not invalidate the new `counterpartyService.getCounterparties` query key. Mitigate by checking existing create hook invalidation behavior and adding invalidation if new rows are expected to appear immediately after closing creation dialogs.
- **Unsupported sort risk:** passing `status` or `type` through as `orderBy` would violate the generated API type. Mitigate with an explicit mapper branch that returns `orderBy: undefined` for unsupported sort keys.

## Completion Criteria

- `CounterpartiesTableContainer` renders counterparties from the generated list API through a feature hook and service.
- Counterparty table UI remains unchanged.
- `counterpartyMapper` explicitly maps table query state to `IGetCounterpartiesQuery`, including unsupported sort-key handling and filter shape conversion.
- Search, pagination, supported sorting, and filters are reflected in URL query params and API query construction.
- `CounterpartiesPage` renders the table container and the table add button opens the existing role-selection dialog.
- Generated API types are used directly without ad hoc DTO definitions.
- Focused tests, structure check, and build pass.
- Unrelated files and behaviors remain unchanged.
