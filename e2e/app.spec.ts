import { test, expect } from '@playwright/test';
import { assertNoPageOverflow, checkA11y } from './helpers/a11y';

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
});
