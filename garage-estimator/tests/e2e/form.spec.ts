import { test, expect } from '@playwright/test';

test('loads the garage estimator app', async ({ page }) => {
  // Point to the dev server (adjust baseURL in playwright.config.ts if needed)
  await page.goto('http://localhost:5173');

  // Confirm that the app loaded
  await expect(page.locator('text=Garage Estimator App')).toBeVisible();
});
