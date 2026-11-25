import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  expect: {
    // The dev server compiles routes on demand; first visits can take longer
    // than Playwright's 5s default when several workers navigate at once.
    timeout: 15_000,
  },
  use: {
    baseURL: 'http://127.0.0.1:3100',
  },
  webServer: {
    command:
      'node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3100',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 1_000 },
  },
});
