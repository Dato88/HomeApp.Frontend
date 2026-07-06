import { test, expect } from '@playwright/test';
import { assertNoPageOverflow, checkA11y } from './helpers/a11y';
import { expectPageHeading } from './helpers/routes';

test('budget page loads in both modes', async ({ page }) => {
  await page.goto('/budget');
  await expectPageHeading(page, 'Budget');
  await assertNoPageOverflow(page);

  await page.getByRole('tab', { name: 'Plan-Editor' }).click();
  await expect(page.getByRole('tab', { name: 'Plan-Editor' })).toHaveAttribute(
    'aria-selected',
    'true'
  );
  await assertNoPageOverflow(page);

  await page.getByRole('tab', { name: 'E+A-Auswertung' }).click();
  await expect(page.getByRole('tab', { name: 'E+A-Auswertung' })).toHaveAttribute(
    'aria-selected',
    'true'
  );
  await assertNoPageOverflow(page);

  await checkA11y(page);
});
