import { useFieldErrorMessage } from '@/shared/hooks/use-field-error-message';
import { describe, expect, it } from 'vitest';

interface IFormValues {
  firstName: string;
  lastName: string;
  items: Array<{
    name: string;
  }>;
  payer: {
    name: string;
  };
}

describe('useFieldErrorMessage', () => {
  it('should return an empty array if the field is not touched', () => {
    const errors = { firstName: 'First Name is required' };
    const touched = { firstName: false };

    const getErrorMessage = useFieldErrorMessage<IFormValues>({
      errors,
      touched,
    });

    expect(getErrorMessage('firstName')).toEqual([]);
  });

  it('should return an empty array if the field is touched but has no error', () => {
    const errors = {};
    const touched = { firstName: true };

    const getErrorMessage = useFieldErrorMessage<IFormValues>({
      errors,
      touched,
    });

    expect(getErrorMessage('firstName')).toEqual([]);
  });

  it('should return an array with a message object when the field is touched and has an error', () => {
    const errors = { firstName: 'First Name is required' };
    const touched = { firstName: true };

    const getErrorMessage = useFieldErrorMessage<IFormValues>({
      errors,
      touched,
    });

    expect(getErrorMessage('firstName')).toEqual([
      { message: 'First Name is required' },
    ]);
  });

  it('should handle multiple fields independently', () => {
    const errors = { firstName: 'Required', lastName: 'Too short' };
    const touched = { firstName: true, lastName: false };

    const getErrorMessage = useFieldErrorMessage<IFormValues>({
      errors,
      touched,
    });

    expect(getErrorMessage('firstName')).toEqual([{ message: 'Required' }]);
    expect(getErrorMessage('lastName')).toEqual([]);
  });

  it('should return a nested error when its path is touched', () => {
    const errors = { payer: { name: 'Payer is required' } };
    const touched = { payer: { name: true } };

    const getErrorMessage = useFieldErrorMessage<IFormValues>({
      errors,
      touched,
    });

    expect(getErrorMessage('payer.name')).toEqual([
      { message: 'Payer is required' },
    ]);
  });

  it('should return an empty array when a nested path is not touched', () => {
    const errors = { payer: { name: 'Payer is required' } };
    const touched = { payer: { name: false } };

    const getErrorMessage = useFieldErrorMessage<IFormValues>({
      errors,
      touched,
    });

    expect(getErrorMessage('payer.name')).toEqual([]);
  });

  it('should return an empty array when a nested path has no error', () => {
    const errors = {};
    const touched = { payer: { name: true } };

    const getErrorMessage = useFieldErrorMessage<IFormValues>({
      errors,
      touched,
    });

    expect(getErrorMessage('payer.name')).toEqual([]);
  });

  it('should return an empty array for an object error', () => {
    const errors = { payer: { name: 'Payer is required' } };
    const touched = { payer: { name: true } };

    const getErrorMessage = useFieldErrorMessage<IFormValues>({
      errors,
      touched,
    });

    expect(getErrorMessage('payer')).toEqual([]);
  });

  it('should return an empty array for an array error', () => {
    const errors = { items: ['Item is required'] };
    const touched = { items: [{ name: true }] };

    const getErrorMessage = useFieldErrorMessage<IFormValues>({
      errors,
      touched,
    });

    expect(getErrorMessage('items')).toEqual([]);
  });
});
