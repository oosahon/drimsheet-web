# Mapper Rules

## Goal

Keep data transformation explicit, deterministic, and separate from validation
and transport.

## Contracts

- Map directly between established contracts, such as form values and generated
  API DTOs.
- Do not create intermediate request or payload types merely to bridge form
  values and a DTO.
- Let services accept generated DTOs and perform transport only.
- Invoke form-to-DTO mappers from an orchestration component such as a page,
  dialog, or container.
- Let API hooks accept the generated DTO used by the wrapped service method and
  delegate it unchanged.
- Do not import component form contracts or feature mappers into API hooks or
  services.

```text
FormValues -> component orchestration -> feature mapper -> generated DTO -> API hook -> service
```

## Responsibilities

- Mappers transform, normalize, and serialize values.
- Use mappers only at boundaries between client-owned contracts and external
  API contracts.
- Mappers must not validate business or form rules.
- Validation belongs in form validation, domain validation, or an API boundary.
- A mapper may assume its input has already passed the owning validation layer.
- Delegate reusable client-domain operations to shared services. A mapper may
  call those services when the same operation is required while constructing an
  external API contract.

## Explicit Mapping

- Assign every destination field explicitly.
- Never use object or array spreads to construct mapper output.
- Never pass source objects through unchanged.
- Do not allow extra source fields to leak into a DTO.
- Mapper tests must assert the complete destination contract for meaningful
  branches.

```ts
// Correct
return {
  name: values.name,
  currencyCode: values.currencyCode,
};

// Incorrect
return {
  ...values,
};
```
