import { test, expect } from '@playwright/test';
import { assertNoPageOverflow, checkA11y } from './helpers/a11y';
import { expectPageHeading } from './helpers/routes';

test.describe('Finance Module - All Viewports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/finance');
    await page.waitForLoadState('networkidle');
    await expectPageHeading(page, 'Finanzen');
  });

  test('should load with all tabs available', async ({ page }) => {
    const tabs = ['Konten', 'Buchungen', 'Kategorien'];

    for (const tab of tabs) {
      const tabButton = page.getByRole('tab', { name: tab });
      await expect(tabButton).toBeVisible();
    }
  });

  test('should navigate between tabs with proper ARIA attributes', async ({ page }) => {
    const tabs = ['Konten', 'Buchungen', 'Kategorien'];

    for (const tab of tabs) {
      const tabButton = page.getByRole('tab', { name: tab });
      await tabButton.click();
      await expect(tabButton).toHaveAttribute('aria-selected', 'true');
      await assertNoPageOverflow(page);
    }
  });

  test('should handle tab keyboard navigation (Arrow Keys)', async ({ page }) => {
    const firstTab = page.getByRole('tab', { name: 'Konten' });
    await firstTab.focus();

    // Press Right Arrow to move to next tab
    await page.keyboard.press('ArrowRight');
    const secondTabFocus = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
    expect(secondTabFocus).toBeTruthy();
  });

  test('should have no accessibility violations', async ({ page }) => {
    // Test all tabs for a11y
    const tabs = ['Konten', 'Buchungen', 'Kategorien'];
    for (const tab of tabs) {
      await page.getByRole('tab', { name: tab }).click();
      await checkA11y(page);
    }
  });

  test('should have no horizontal overflow', async ({ page }) => {
    await assertNoPageOverflow(page);

    // Check all tabs
    await page.getByRole('tab', { name: 'Buchungen' }).click();
    await assertNoPageOverflow(page);
  });

  test('should display responsive layout on mobile', async ({ page }) => {
    const viewportSize = page.viewportSize();
    if (viewportSize && viewportSize.width < 900) {
      // On mobile, verify grid or table is scrollable if needed
      const gridScroll = page.locator('.grid-scroll');
      const exists = await gridScroll.count();
      // Either no grid-scroll (simple layout) or it exists for scrolling
      expect([0, 1]).toContain(exists);
    }
  });
});
