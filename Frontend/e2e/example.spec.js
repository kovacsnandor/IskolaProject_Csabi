// @ts-check
import { test, expect } from '@playwright/test';
const url = 'http://localhost:5173';

test('has title', async ({ page }) => {
  await page.goto(`${url}/`);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Iskola - Főoldal/);
});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
