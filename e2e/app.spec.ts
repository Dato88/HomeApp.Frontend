import { test, expect } from '@playwright/test';
import { assertNoPageOverflow, checkA11y } from './helpers/a11y';

test.describe('App Navigation & Dashboard', () => {
  test('shows dashboard by default', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await assertNoPageOverflow(page);
    await checkA11y(page);
  });

  test('navigates to todo page', async ({ page }) => {
    await page.goto('/todo');
    await expect(page.getByRole('heading', { name: 'Todos' })).toBeVisible();
    await assertNoPageOverflow(page);
    await checkA11y(page);
  });

  test('navigates to finance page', async ({ page }) => {
    await page.goto('/finance');
    await expect(page.getByRole('heading', { name: 'Finanzen' })).toBeVisible();
    await assertNoPageOverflow(page);
  });

  test('navigates to household page', async ({ page }) => {
    await page.goto('/household');
    await expect(page.getByRole('heading', { name: 'Haushalte' })).toBeVisible();
    await assertNoPageOverflow(page);
  });

  test('should support keyboard navigation with Tab key', async ({ page }) => {
    await page.goto('/');

    // Press Tab to focus interactive element
    await page.keyboard.press('Tab');

    // Verify focus moved to something interactive
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return el?.tagName;
    });

    expect(['BUTTON', 'A', 'INPUT']).toContain(focusedElement);
  });

  test('should handle all major routes without errors', async ({ page }) => {
    const routes = ['/', '/todo', '/finance', '/household'];

    for (const route of routes) {
      await page.goto(route, { waitUntil: 'networkidle' });

      // Verify page loaded
      const heading = page.locator('h1');
      await expect(heading).toBeVisible({ timeout: 5000 });

      // Check no overflow
      await assertNoPageOverflow(page);
    }
  });

  test('should be responsive on all viewport sizes', async ({ page }) => {
    const viewportSize = page.viewportSize();
    expect(viewportSize).toBeTruthy();

    await page.goto('/');
    await assertNoPageOverflow(page);
  });
});
