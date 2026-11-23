import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/pwa',
  use: {
    baseURL: 'http://127.0.0.1:3101',
    serviceWorkers: 'allow',
  },
  webServer: {
    command:
      'node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3101',
    url: 'http://127.0.0.1:3101',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 1_000 },
  },
});
