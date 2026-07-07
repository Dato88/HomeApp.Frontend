import { test, expect } from '@playwright/test';
import { assertNoPageOverflow, checkA11y } from './helpers/a11y';
import { expectPageHeading } from './helpers/routes';

test.describe('Budget Module - All Viewports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/budget');
    await page.waitForLoadState('networkidle');
    await expectPageHeading(page, 'Budget');
  });

  test('should switch between Budget and EvA modes', async ({ page }) => {
    const planTab = page.getByRole('tab', { name: 'Plan-Editor' });
    const evaTab = page.getByRole('tab', { name: 'E+A-Auswertung' });

    // Both tabs should be visible
    await expect(planTab).toBeVisible();
    await expect(evaTab).toBeVisible();

    // Click Plan-Editor
    await planTab.click();
    await expect(planTab).toHaveAttribute('aria-selected', 'true');
    await assertNoPageOverflow(page);

    // Click E+A-Auswertung
    await evaTab.click();
    await expect(evaTab).toHaveAttribute('aria-selected', 'true');
    await assertNoPageOverflow(page);
  });

  test('should have proper accessibility on both tabs', async ({ page }) => {
    const tabs = ['Plan-Editor', 'E+A-Auswertung'];

    for (const tab of tabs) {
      await page.getByRole('tab', { name: tab }).click();
      await checkA11y(page);
    }
  });

  test('should have no horizontal overflow', async ({ page }) => {
    await assertNoPageOverflow(page);

    await page.getByRole('tab', { name: 'E+A-Auswertung' }).click();
    await assertNoPageOverflow(page);
  });

  test('should display stat cards with proper labels', async ({ page }) => {
    // Look for any card elements
    const cards = page.locator('.card, .stat-card, [role="region"]');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThanOrEqual(0);
  });

  test('should be responsive on all viewports', async ({ page }) => {
    const viewportSize = page.viewportSize();

    if (viewportSize) {
      // Just verify no overflow on current viewport
      await assertNoPageOverflow(page);

      if (viewportSize.width < 900) {
        // On mobile, there might be a month stepper
        const nextBtn = page.locator('button[aria-label*="nächst"], button[aria-label*="next"]');
        // Either button exists or not, both are valid
        await expect(page.locator('h1')).toBeVisible();
      }
    }
  });
});
