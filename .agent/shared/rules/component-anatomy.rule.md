# Component Anatomy Rule

Inside every component function, order variables, hooks and event handlers in the following order. Note that this is a guide, not a hard and fast rule. Exceptions are acceptable when necessary (e.g., initializing `useState` with a custom hook's return value).

- third party library hooks (eg, `useNavigate`, `useQuery`, `useMutation`, `useTranslation`)
- React's useState
- React's useRef
- React's useReducer
- React's useMemo (for derived state or complex calculations)
- custom hooks (eg `useGetUser`, `useCreateEntity`, etc)
- formik hooks (eg `useFormik`, `useField`, `useFormikContext`, etc)
- event handlers (e.g, `handleSubmit`, `handleChange`, etc) - Note: `useCallback`-wrapped handlers should be collocated here.
- useEffect
- early returns / guard clauses (e.g., `if (isLoading) return <Loader />`)
- destructures and UI related variable declarations (specifically data needed for the UI)
- translations extraction (eg `const sign_in_text = t('auth:sign_in_text')`)
- ui element rendering

**Notes:**

- **Translations in Handlers:** If an event handler needs a translated string (e.g., for a toast notification), you can extract it inline inside the handler or instantiate the translation text just before the notification.

## Anti-Pattern: Avoid `useEffect`

> [!WARNING]
> **Agent Instruction:** Do NOT use `useEffect` unless absolutely necessary. Think carefully before adding an effect.

Before reaching for a `useEffect`, ask yourself if it can be avoided:

- **Derived State:** If you are calculating a value based on props or existing state, do it directly during render (or use `useMemo`). Do not use an effect to synchronize state.
- **User Events:** If you are handling a user action (e.g., submitting a form, clicking a button), the logic belongs directly in the event handler, not in an effect.
- **When to use it:** Only use `useEffect` for synchronizing with external systems (e.g., setting up subscriptions, direct DOM manipulation, or integrating with non-React libraries).
