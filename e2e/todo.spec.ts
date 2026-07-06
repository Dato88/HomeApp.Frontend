import { test } from '@playwright/test';
import { verifyRoute } from './helpers/routes';

test('todo page loads', async ({ page }) => {
  await verifyRoute(page, '/todo', 'Todos');
});
