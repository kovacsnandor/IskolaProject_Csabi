// @ts-check
import { test, expect } from '@playwright/test';

const url = 'http://localhost:5173';

// test('/: Loads home page', async ({ page }) => {
//   await page.goto(`${url}/`);
//   // await page.goto('http://localhost:5173/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Iskola - Főoldal/);
//   await expect(page.locator('h2')).toHaveText('Home');
// });

// test('Login with Admin', async ({ page }) => {
//   // Nyisd meg a bejelentkezési oldalt
//   await page.goto(`${url}/login`);

//   // Töltsd ki az űrlapot
//   await page.fill('input#email', 'test@example.com');
//   await page.fill('input#password', '123');
//   // await page.fill('input[name="email"]', 'test@example.com');
//   // await page.fill('input[name="password"]', '123');

//   // Kattints a bejelentkezés gombra
//   // await page.click('button[type="submit"]');
//   await page.click('button:has-text("Login")');

//   // Ellenőrizd, hogy sikeres bejelentkezés után átirányították a felhasználót
//   await expect(page).toHaveURL(`${url}/`);
//   await expect(page.locator('h2')).toHaveText('Home');

// });

test('Goto Kártyák', async ({ page }) => {
  // Nyisd meg a bejelentkezési oldalt
  // await page.goto(`${url}/login`);

  // // Töltsd ki az űrlapot
  // await page.fill('input#email', 'test@example.com');
  // await page.fill('input#password', '123');
  // // await page.fill('input[name="email"]', 'test@example.com');
  // // await page.fill('input[name="password"]', '123');

  // // Kattints a bejelentkezés gombra
  // // await page.click('button[type="submit"]');
  // await page.click('button:has-text("Login")');

  // Nyisd meg a dropdown menüt az Iskola menüpontra kattintva
  // Use a more specific selector for the "Iskola" menu item
  await page.goto(`${url}/`);
  await page.click('nav a:has-text("Iskola")');

  // Wait for the dropdown menu to be visible
  await expect(page.locator('nav .dropdown-menu:has(a:has-text("Kártyák"))')).toBeVisible();

  // Click the "Kártyák" menu item
  await page.click('nav a:has-text("Kártyák")');
  await expect(page.locator('h2')).toHaveText('Kártyák');
  

});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
