import { test, expect } from '@playwright/test';

test('shows dashboard by default', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test('navigates to todo page', async ({ page }) => {
  await page.goto('/todo');
  await expect(page.getByRole('heading', { name: 'Todo' })).toBeVisible();
});
