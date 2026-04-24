# You May Not Need useEffect: Money Input Formatting Edition

## Table of Contents

- [Introduction](#introduction)
- [The Problem: Synchronizing Formatted Input](#the-problem-synchronizing-formatted-input)
- [With useEffect](#with-useeffect)
- [Without useEffect: Derived State During Render](#without-useeffect-derived-state-during-render)
- [Conclusion](#conclusion)

## Introduction

Formatting inputs as the user types—especially for monetary values with decimal points and commas—is surprisingly complex in React. Often, the parent component normalizes the value (e.g., stripping trailing decimals like `10.`), while the child component needs to retain them so the user can continue typing. This often leads developers to write complex synchronization logic.

## The Problem: Synchronizing Formatted Input

When the parent component provides a strict numerical value as a prop, but the input needs to display an intermediate string (like `"10."`), we must keep a `localValue` state. We only want to update the `localValue` from the prop if the prop represents a _numerically different_ value than what the user is currently typing.

## With useEffect

The instinctive React pattern for synchronizing a prop with local state is `useEffect`.

```tsx
const [localValue, setLocalValue] = useState('');

// ... formatting logic ...

useEffect(() => {
  const rawLocal = parseRawValue(localValue);
  const rawProps = parseRawValue(value);

  const numLocal = Number(rawLocal === '-' || rawLocal === '' ? '0' : rawLocal);
  const numProps = Number(rawProps === '-' || rawProps === '' ? '0' : rawProps);

  const isNumericallyEqual = numLocal === numProps;
  const isOneEmpty =
    (rawLocal === '' && rawProps !== '') ||
    (rawLocal !== '' && rawProps === '');
  const needsReformat = localValue !== formatVal(rawLocal);

  if (!isNumericallyEqual || isOneEmpty || needsReformat) {
    if (isNumericallyEqual && needsReformat) {
      setLocalValue(formatVal(rawLocal));
    } else {
      setLocalValue(formatVal(rawProps));
    }
  }
}, [value, formatVal, localValue]);
```

**Why this is an anti-pattern:**
Synchronizing state with props inside `useEffect` causes redundant render cycles. React renders the input with the old state, commits it to the DOM, runs the effect, updates the state, and forces a second render and layout pass. This can lead to performance overhead and jumpy cursor placement.

## Without useEffect: Derived State During Render

We can avoid the extra render cycle entirely by applying the "Derived State During Render" pattern. By checking if the prop (or our formatter function) has changed directly within the component body, React can abort the current render and immediately restart with the updated state.

```tsx
const [prevValueProp, setPrevValueProp] = useState(value);
const [prevFormatVal, setPrevFormatVal] = useState(() => formatVal);

// Initialize with formatted prop
const [localValue, setLocalValue] = useState(() =>
  formatVal(parseRawValue(value))
);

// Derive state during render
if (value !== prevValueProp || formatVal !== prevFormatVal) {
  setPrevValueProp(value);
  setPrevFormatVal(() => formatVal);

  const rawLocal = parseRawValue(localValue);
  const rawProps = parseRawValue(value);

  const numLocal = Number(rawLocal === '-' || rawLocal === '' ? '0' : rawLocal);
  const numProps = Number(rawProps === '-' || rawProps === '' ? '0' : rawProps);

  const isNumericallyEqual = numLocal === numProps;
  const isOneEmpty =
    (rawLocal === '' && rawProps !== '') ||
    (rawLocal !== '' && rawProps === '');
  const needsReformat = localValue !== formatVal(rawLocal);

  if (!isNumericallyEqual || isOneEmpty || needsReformat) {
    if (isNumericallyEqual && needsReformat) {
      setLocalValue(formatVal(rawLocal));
    } else {
      setLocalValue(formatVal(rawProps));
    }
  }
}
```

## Conclusion

By moving the exact same intelligent synchronization logic from `useEffect` into the component's render body, we eliminate a redundant layout and paint cycle. The `MoneyInput` component remains robust, handling trailing decimals and formatting changes gracefully, but operates much more efficiently.
