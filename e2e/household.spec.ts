import { test } from '@playwright/test';
import { verifyRoute } from './helpers/routes';

test('household page loads', async ({ page }) => {
  await verifyRoute(page, '/household', 'Haushalte');
});
