import { test, expect } from '@playwright/test';
import { assertNoPageOverflow, checkA11y } from './helpers/a11y';
import { expectPageHeading } from './helpers/routes';

test.describe('Todo Module - All Viewports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/todo');
    await page.waitForLoadState('networkidle');
  });

  test('should render without accessibility violations', async ({ page }) => {
    await expectPageHeading(page, 'Todos');
    await assertNoPageOverflow(page);
    await checkA11y(page);
  });

  test('should have proper keyboard navigation', async ({ page }) => {
    // Tab to first button
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'INPUT', 'A']).toContain(focusedElement);
  });

  test('should show proper ARIA labels on action buttons', async ({ page }) => {
    const buttons = page.locator('button[aria-label]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have no horizontal overflow on mobile', async ({ page }) => {
    // This test runs on all viewport sizes including mobile
    await assertNoPageOverflow(page);
  });
});
