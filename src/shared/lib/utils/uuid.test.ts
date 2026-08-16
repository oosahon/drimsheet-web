import { generateUUID, isValidUUID } from '@/shared/lib/utils/uuid';
import { describe, expect, it } from 'vitest';

describe('UUID utilities', () => {
  it('generates a valid UUIDv7', () => {
    const uuid = generateUUID();

    expect(isValidUUID(uuid)).toBe(true);
    expect(uuid[14]).toBe('7');
  });

  it('accepts other valid UUID versions', () => {
    expect(isValidUUID('5b93d2c6-62f0-4f0f-8ef8-f81cb405b508')).toBe(true);
  });

  it.each([undefined, null, 123, '', 'not-a-uuid', 'private@example.com'])(
    'rejects the invalid value %s',
    (value) => {
      expect(isValidUUID(value)).toBe(false);
    }
  );
});
