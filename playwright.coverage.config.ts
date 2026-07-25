import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

export default defineConfig({
  ...baseConfig,
  metadata: {
    ...baseConfig.metadata,
    collectCoverage: true,
  },
  outputDir: 'test-results/coverage',
  reporter: [
    [process.env.CI ? 'line' : 'list'],
    [
      'html',
      {
        open: 'never',
        outputFolder: 'playwright-report/coverage',
      },
    ],
    [
      './playwright/reporters/coverage-reporter.ts',
      {
        inputDir: 'test-results/coverage',
        outputDir: 'coverage/playwright',
      },
    ],
  ],
});
