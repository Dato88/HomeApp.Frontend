import { expect, type Page } from '@playwright/test';
import { assertNoPageOverflow, checkA11y } from './a11y';

export async function expectPageHeading(page: Page, name: string | RegExp): Promise<void> {
  await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
}

export async function verifyRoute(page: Page, path: string, heading: string | RegExp): Promise<void> {
  await page.goto(path);
  await expectPageHeading(page, heading);
  await assertNoPageOverflow(page);
  await checkA11y(page);
}
