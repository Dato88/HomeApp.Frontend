import { test, expect } from '@playwright/test';
import { assertNoPageOverflow, checkA11y } from './helpers/a11y';
import { expectPageHeading } from './helpers/routes';

test('finance page loads with all tabs', async ({ page }) => {
  await page.goto('/finance');
  await expectPageHeading(page, 'Finanzen');
  await assertNoPageOverflow(page);

  const tabs = ['Konten', 'Buchungen', 'Kategorien'];

  for (const tab of tabs) {
    await page.getByRole('tab', { name: tab }).click();
    await expect(page.getByRole('tab', { name: tab })).toHaveAttribute('aria-selected', 'true');
    await assertNoPageOverflow(page);
  }

  await checkA11y(page);
});
