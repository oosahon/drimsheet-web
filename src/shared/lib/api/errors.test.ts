import type { IHttpErrorDto } from '@/shared/lib/api/Api';
import { isFeatureFlagApiError, parseApiError } from '@/shared/lib/api/errors';
import type { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';

const VALID_CORRELATION_ID = '0198ad49-0f4a-7709-a5bf-2f7cfbaea7c4';

function makeAxiosError(
  overrides: Partial<AxiosError<IHttpErrorDto>>
): AxiosError<IHttpErrorDto> {
  return {
    isAxiosError: true,
    name: 'AxiosError',
    message: 'Request failed',
    toJSON: () => ({}),
    ...overrides,
  } as AxiosError<IHttpErrorDto>;
}

describe('parseApiError', () => {
  it('classifies a Core response and extracts a valid correlation ID', () => {
    const error = makeAxiosError({
      config: { method: 'post', headers: {} as never },
      response: {
        status: 500,
        statusText: 'Internal Server Error',
        config: { headers: {} as never },
        headers: { 'x-correlation-id': VALID_CORRELATION_ID },
        data: {
          name: 'RuntimeError',
          errorKey: 'runtime_error_unavailable',
          validationErrors: [{ field: 'name', message: 'Invalid name' }],
        },
      },
    });

    expect(parseApiError(error)).toEqual({
      code: 500,
      statusCode: 500,
      name: 'RuntimeError',
      errorKey: 'runtime_error_unavailable',
      validationErrors: [{ field: 'name', message: 'Invalid name' }],
      cause: undefined,
      kind: 'server-response',
      correlationId: VALID_CORRELATION_ID,
      method: 'POST',
    });
  });

  it('does not attach a malformed correlation header', () => {
    const error = makeAxiosError({
      response: {
        status: 404,
        statusText: 'Not Found',
        config: { headers: {} as never },
        headers: { 'x-correlation-id': 'private@example.com' },
        data: { name: 'NotFoundError', errorKey: 'not_found' },
      },
    });

    expect(parseApiError(error)).toEqual(
      expect.objectContaining({
        code: 404,
        statusCode: 404,
        kind: 'server-response',
      })
    );
    expect(parseApiError(error).correlationId).toBeUndefined();
  });

  it('distinguishes a network failure with no response', () => {
    const error = makeAxiosError({
      config: { method: 'get', headers: {} as never },
      request: {},
    });

    expect(parseApiError(error)).toEqual({
      code: 0,
      name: 'AxiosError',
      errorKey: '',
      validationErrors: [],
      kind: 'network',
      method: 'GET',
    });
  });

  it('distinguishes an Axios client setup failure from a network failure', () => {
    const error = makeAxiosError({
      config: { method: 'patch', headers: {} as never },
    });

    expect(parseApiError(error)).toEqual({
      code: 0,
      name: 'AxiosError',
      errorKey: '',
      validationErrors: [],
      kind: 'client',
      method: 'PATCH',
    });
  });

  it('classifies non-Axios thrown values as client failures', () => {
    expect(parseApiError(new SyntaxError('private payload'))).toEqual({
      code: 0,
      name: 'SyntaxError',
      errorKey: '',
      validationErrors: [],
      kind: 'client',
    });
  });
});

describe('isFeatureFlagApiError', () => {
  it('matches a normalized Core feature-flag response', () => {
    const error = makeAxiosError({
      response: {
        status: 403,
        statusText: 'Forbidden',
        config: { headers: {} as never },
        headers: {},
        data: {
          name: 'FeatureFlagError',
          errorKey: 'feature_flag_error_forbidden',
          validationErrors: [],
        },
      },
    });

    expect(isFeatureFlagApiError(error)).toBe(true);
  });

  it('does not match an unrelated forbidden response', () => {
    const error = makeAxiosError({
      response: {
        status: 403,
        statusText: 'Forbidden',
        config: { headers: {} as never },
        headers: {},
        data: {
          name: 'ForbiddenError',
          errorKey: 'authorization_error_forbidden',
          validationErrors: [],
        },
      },
    });

    expect(isFeatureFlagApiError(error)).toBe(false);
  });

  it('does not match client or network failures', () => {
    expect(isFeatureFlagApiError(new Error('client failure'))).toBe(false);
    expect(isFeatureFlagApiError(makeAxiosError({ request: {} }))).toBe(false);
  });
});
