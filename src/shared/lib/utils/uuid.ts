import { v7, validate } from 'uuid';
import * as yup from 'yup';

const UUID_SCHEMA = yup
  .string()
  .strict()
  .required()
  .test({
    name: 'uuid',
    test: (value) => typeof value === 'string' && validate(value),
  });

export function generateUUID() {
  return v7();
}

export function isValidUUID(value: unknown): value is string {
  return UUID_SCHEMA.isValidSync(value);
}
