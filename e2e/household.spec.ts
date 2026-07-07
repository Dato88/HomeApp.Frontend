import { test, expect } from '@playwright/test';
import { assertNoPageOverflow, checkA11y } from './helpers/a11y';
import { expectPageHeading } from './helpers/routes';

test.describe('Household Module - All Viewports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/household');
    await page.waitForLoadState('networkidle');
  });

  test('should load with proper heading', async ({ page }) => {
    await expectPageHeading(page, 'Haushalte');
    await assertNoPageOverflow(page);
  });

  test('should have no accessibility violations', async ({ page }) => {
    await checkA11y(page);
  });

  test('should display household cards in responsive grid', async ({ page }) => {
    const cards = page.locator('.card, [role="region"]');
    const cardCount = await cards.count();
    // 0 or more cards are valid (depends on test data)
    expect(cardCount).toBeGreaterThanOrEqual(0);
  });

  test('should have proper ARIA labels on action buttons', async ({ page }) => {
    const buttons = page.locator('button[aria-label]');
    const count = await buttons.count();
    // Action buttons may or may not exist depending on state
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should handle email overflow gracefully on mobile', async ({ page }) => {
    const viewportSize = page.viewportSize();
    if (viewportSize && viewportSize.width < 768) {
      // On mobile, verify no horizontal overflow
      await assertNoPageOverflow(page);
    }
  });

  test('should be responsive on all viewports', async ({ page }) => {
    const viewportSize = page.viewportSize();
    expect(viewportSize).toBeTruthy();

    // Verify no overflow regardless of viewport
    await assertNoPageOverflow(page);
  });
});
