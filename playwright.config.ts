import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30 * 1000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173',
    browserName: 'chromium',
    headless: true,
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev --prefix frontend',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
