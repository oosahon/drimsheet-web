import {
  APP_RELEASE,
  createObservabilityConfig,
} from '@/shared/lib/configs/observability.config';
import { describe, expect, it } from 'vitest';

const VALID_ENVIRONMENT = {
  VITE_APP_ENV: 'staging',
  VITE_SENTRY_DSN: 'https://public-key@o1.ingest.sentry.io/123',
} as const;

describe('createObservabilityConfig', () => {
  it('enables a valid remote configuration', () => {
    expect(createObservabilityConfig(VALID_ENVIRONMENT)).toEqual({
      dsn: VALID_ENVIRONMENT.VITE_SENTRY_DSN,
      enabled: true,
      environment: 'staging',
      release: APP_RELEASE,
      tracesSampleRate: 1,
    });
  });

  it.each(['local', 'test'])(
    'keeps %s error reporting enabled while disabling trace sampling',
    (environment) => {
      const config = createObservabilityConfig({
        ...VALID_ENVIRONMENT,
        VITE_APP_ENV: environment,
      });

      expect(config.enabled).toBe(true);
      expect(config.tracesSampleRate).toBe(0);
    }
  );

  it.each([undefined, 'preview'])(
    'enables error reporting with a valid DSN when the environment is %s',
    (environment) => {
      const config = createObservabilityConfig({
        ...VALID_ENVIRONMENT,
        VITE_APP_ENV: environment,
      });

      expect(config.enabled).toBe(true);
      expect(config.environment).toBe('local');
      expect(config.tracesSampleRate).toBe(0);
    }
  );

  it('falls back safely for an invalid environment and DSN', () => {
    const config = createObservabilityConfig({
      ...VALID_ENVIRONMENT,
      VITE_APP_ENV: 'preview',
      VITE_SENTRY_DSN: 'not-a-dsn',
    });

    expect(config).toEqual({
      enabled: false,
      environment: 'local',
      release: APP_RELEASE,
      tracesSampleRate: 0,
    });
  });

  it.each([
    ['development', 1],
    ['staging', 1],
    ['production', 0.1],
  ] as const)(
    'uses the code-owned %s sample rate',
    (environment, sampleRate) => {
      const config = createObservabilityConfig({
        ...VALID_ENVIRONMENT,
        VITE_APP_ENV: environment,
      });

      expect(config.tracesSampleRate).toBe(sampleRate);
    }
  );

  it('disables telemetry when the DSN is empty', () => {
    const config = createObservabilityConfig({
      ...VALID_ENVIRONMENT,
      VITE_SENTRY_DSN: '',
    });

    expect(config.enabled).toBe(false);
    expect(config.dsn).toBeUndefined();
  });
});
